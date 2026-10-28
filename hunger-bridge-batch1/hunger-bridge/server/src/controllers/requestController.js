const prisma = require("../config/db");
const { validateRequestInput } = require("../validators/requestValidators");

const NGO_PUBLIC_SELECT = {
  select: {
    id: true,
    name: true,
    phone: true,
    ngoProfile: { select: { organizationName: true, city: true, verificationStatus: true } },
  },
};

const DONATION_SUMMARY_SELECT = {
  select: {
    id: true,
    title: true,
    city: true,
    status: true,
    expiresAt: true,
    quantity: true,
    quantityUnit: true,
    donorId: true,
  },
};

/**
 * POST /api/requests
 * An approved NGO requests a donation. Multiple NGOs can request the same
 * donation while it's open — the donor picks one at accept time, which is
 * what actually locks it (see acceptRequest below).
 */
async function createRequest(req, res) {
  const errors = validateRequestInput(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ message: errors[0], errors });
  }

  const ngoProfile = await prisma.ngoProfile.findUnique({ where: { userId: req.user.id } });
  if (!ngoProfile || ngoProfile.verificationStatus !== "APPROVED") {
    return res
      .status(403)
      .json({ message: "Only verified NGOs can request donations. Your account is pending admin approval." });
  }

  const donationId = Number(req.body.donationId);
  const donation = await prisma.donation.findUnique({ where: { id: donationId } });

  if (!donation) {
    return res.status(404).json({ message: "Donation not found." });
  }
  if (!["AVAILABLE", "REQUESTED"].includes(donation.status)) {
    return res.status(409).json({ message: `This donation is no longer open for requests (status: ${donation.status}).` });
  }
  if (donation.expiresAt.getTime() <= Date.now()) {
    return res.status(409).json({ message: "This donation's pickup window has expired." });
  }

  const existingRequest = await prisma.donationRequest.findUnique({
    where: { donationId_ngoId: { donationId, ngoId: req.user.id } },
  });
  if (existingRequest) {
    return res.status(409).json({ message: "You've already requested this donation." });
  }

  const request = await prisma.$transaction(async (tx) => {
    const created = await tx.donationRequest.create({
      data: {
        donationId,
        ngoId: req.user.id,
        message: req.body.message || null,
        status: "PENDING",
      },
    });

    if (donation.status === "AVAILABLE") {
      await tx.donation.update({ where: { id: donationId }, data: { status: "REQUESTED" } });
      await tx.donationStatusHistory.create({
        data: {
          donationId,
          status: "REQUESTED",
          changedByUserId: req.user.id,
          note: "First request received.",
        },
      });
    }

    await tx.notification.create({
      data: {
        userId: donation.donorId,
        type: "DONATION_REQUESTED",
        title: "New request on your donation",
        message: `${ngoProfile.organizationName} requested "${donation.title}".`,
        relatedDonationId: donationId,
        relatedRequestId: created.id,
      },
    });

    return created;
  });

  res.status(201).json({ message: "Request submitted.", request });
}

/**
 * GET /api/requests/mine
 * An NGO's own submitted requests, most recent first.
 */
async function getMyRequests(req, res) {
  const requests = await prisma.donationRequest.findMany({
    where: { ngoId: req.user.id },
    include: { donation: DONATION_SUMMARY_SELECT },
    orderBy: { createdAt: "desc" },
  });
  res.status(200).json({ requests });
}

/**
 * GET /api/requests/donation/:donationId
 * All requests on one donation — donor (owner) only.
 */
async function getRequestsForDonation(req, res) {
  const donationId = Number(req.params.donationId);
  const donation = await prisma.donation.findUnique({ where: { id: donationId } });

  if (!donation) {
    return res.status(404).json({ message: "Donation not found." });
  }
  if (donation.donorId !== req.user.id) {
    return res.status(403).json({ message: "You can only view requests on your own donations." });
  }

  const requests = await prisma.donationRequest.findMany({
    where: { donationId },
    include: { ngo: NGO_PUBLIC_SELECT },
    orderBy: { createdAt: "asc" },
  });

  res.status(200).json({ requests });
}

/**
 * PATCH /api/requests/:id/accept
 * Donor accepts one PENDING request. This is the operation that must be
 * race-safe: if two NGOs' requests were both PENDING and the donor's UI
 * somehow fired two accepts, only one can win. We rely on an atomic
 * updateMany guarded by status so the second call affects zero rows.
 */
async function acceptRequest(req, res) {
  const requestId = Number(req.params.id);

  const request = await prisma.donationRequest.findUnique({
    where: { id: requestId },
    include: { donation: true, ngo: { include: { ngoProfile: true } } },
  });

  if (!request) {
    return res.status(404).json({ message: "Request not found." });
  }
  if (request.donation.donorId !== req.user.id) {
    return res.status(403).json({ message: "You can only manage requests on your own donations." });
  }
  if (request.status !== "PENDING") {
    return res.status(409).json({ message: `This request is no longer pending (status: ${request.status}).` });
  }

  const result = await prisma.$transaction(async (tx) => {
    // Atomically flip this request PENDING -> ACCEPTED. If another
    // concurrent request already changed it, this affects 0 rows.
    const requestUpdate = await tx.donationRequest.updateMany({
      where: { id: requestId, status: "PENDING" },
      data: { status: "ACCEPTED" },
    });
    if (requestUpdate.count === 0) {
      throw Object.assign(new Error("This request was just updated by someone else. Please refresh."), {
        statusCode: 409,
      });
    }

    // Atomically lock the donation itself the same way, so a second accept
    // attempt (e.g. a double click) can never succeed twice.
    const donationUpdate = await tx.donation.updateMany({
      where: { id: request.donationId, status: { in: ["AVAILABLE", "REQUESTED"] } },
      data: { status: "ACCEPTED" },
    });
    if (donationUpdate.count === 0) {
      throw Object.assign(new Error("This donation was already claimed by another NGO."), {
        statusCode: 409,
      });
    }

    // Reject every other still-pending request for this donation.
    const otherPending = await tx.donationRequest.findMany({
      where: { donationId: request.donationId, status: "PENDING", id: { not: requestId } },
    });

    if (otherPending.length > 0) {
      await tx.donationRequest.updateMany({
        where: { id: { in: otherPending.map((r) => r.id) } },
        data: { status: "REJECTED" },
      });
    }

    await tx.donationStatusHistory.create({
      data: {
        donationId: request.donationId,
        status: "ACCEPTED",
        changedByUserId: req.user.id,
        note: `Accepted request from ${request.ngo.ngoProfile?.organizationName || request.ngo.name}.`,
      },
    });

    await tx.notification.create({
      data: {
        userId: request.ngoId,
        type: "REQUEST_ACCEPTED",
        title: "Your request was accepted!",
        message: `Your request for "${request.donation.title}" was accepted. Coordinate pickup with the donor.`,
        relatedDonationId: request.donationId,
        relatedRequestId: request.id,
      },
    });

    for (const rejected of otherPending) {
      await tx.notification.create({
        data: {
          userId: rejected.ngoId,
          type: "REQUEST_REJECTED",
          title: "Request not accepted",
          message: `"${request.donation.title}" was given to another NGO this time.`,
          relatedDonationId: request.donationId,
          relatedRequestId: rejected.id,
        },
      });
    }

    return tx.donation.findUnique({ where: { id: request.donationId } });
  });

  res.status(200).json({ message: "Request accepted.", donation: result });
}

/**
 * PATCH /api/requests/:id/reject
 * Donor rejects one PENDING request. If that was the only pending request
 * left, the donation re-opens to AVAILABLE so other NGOs can request it.
 */
async function rejectRequest(req, res) {
  const requestId = Number(req.params.id);
  const request = await prisma.donationRequest.findUnique({
    where: { id: requestId },
    include: { donation: true },
  });

  if (!request) {
    return res.status(404).json({ message: "Request not found." });
  }
  if (request.donation.donorId !== req.user.id) {
    return res.status(403).json({ message: "You can only manage requests on your own donations." });
  }
  if (request.status !== "PENDING") {
    return res.status(409).json({ message: `This request is no longer pending (status: ${request.status}).` });
  }

  await prisma.$transaction(async (tx) => {
    await tx.donationRequest.update({ where: { id: requestId }, data: { status: "REJECTED" } });

    const remainingPending = await tx.donationRequest.count({
      where: { donationId: request.donationId, status: "PENDING" },
    });

    if (remainingPending === 0 && request.donation.status === "REQUESTED") {
      await tx.donation.update({ where: { id: request.donationId }, data: { status: "AVAILABLE" } });
      await tx.donationStatusHistory.create({
        data: {
          donationId: request.donationId,
          status: "AVAILABLE",
          changedByUserId: req.user.id,
          note: "Re-opened after request was rejected.",
        },
      });
    }

    await tx.notification.create({
      data: {
        userId: request.ngoId,
        type: "REQUEST_REJECTED",
        title: "Request not accepted",
        message: `Your request for "${request.donation.title}" was not accepted.`,
        relatedDonationId: request.donationId,
        relatedRequestId: request.id,
      },
    });
  });

  res.status(200).json({ message: "Request rejected." });
}

/**
 * PATCH /api/requests/:id/cancel
 * NGO withdraws its own PENDING request.
 */
async function cancelRequest(req, res) {
  const requestId = Number(req.params.id);
  const request = await prisma.donationRequest.findUnique({
    where: { id: requestId },
    include: { donation: true },
  });

  if (!request) {
    return res.status(404).json({ message: "Request not found." });
  }
  if (request.ngoId !== req.user.id) {
    return res.status(403).json({ message: "You can only cancel your own requests." });
  }
  if (request.status !== "PENDING") {
    return res.status(409).json({ message: `This request can no longer be cancelled (status: ${request.status}).` });
  }

  await prisma.$transaction(async (tx) => {
    await tx.donationRequest.update({ where: { id: requestId }, data: { status: "CANCELLED" } });

    const remainingPending = await tx.donationRequest.count({
      where: { donationId: request.donationId, status: "PENDING" },
    });

    if (remainingPending === 0 && request.donation.status === "REQUESTED") {
      await tx.donation.update({ where: { id: request.donationId }, data: { status: "AVAILABLE" } });
    }
  });

  res.status(200).json({ message: "Request cancelled." });
}

module.exports = {
  createRequest,
  getMyRequests,
  getRequestsForDonation,
  acceptRequest,
  rejectRequest,
  cancelRequest,
};
