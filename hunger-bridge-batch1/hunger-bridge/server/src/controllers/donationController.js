const prisma = require("../config/db");
const { validateDonationInput } = require("../validators/donationValidators");

const DONOR_PUBLIC_SELECT = {
  select: {
    id: true,
    name: true,
    phone: true,
    donorProfile: {
      select: { organizationName: true, donorType: true, city: true },
    },
  },
};

async function createDonation(req, res) {
  const errors = validateDonationInput(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ message: errors[0], errors });
  }

  const {
    title,
    description,
    foodCategory,
    foodType,
    quantity,
    quantityUnit,
    servesApprox,
    preparedAt,
    expiresAt,
    pickupAddress,
    city,
    state,
    pincode,
    imageUrl,
  } = req.body;

  const donation = await prisma.$transaction(async (tx) => {
    const created = await tx.donation.create({
      data: {
        donorId: req.user.id,
        title: title.trim(),
        description: description.trim(),
        foodCategory,
        foodType,
        quantity: Number(quantity),
        quantityUnit,
        servesApprox: servesApprox ? Number(servesApprox) : null,
        preparedAt: preparedAt ? new Date(preparedAt) : null,
        expiresAt: new Date(expiresAt),
        pickupAddress: pickupAddress.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
        imageUrl: imageUrl || null,
        status: "AVAILABLE",
      },
    });

    await tx.donationStatusHistory.create({
      data: {
        donationId: created.id,
        status: "AVAILABLE",
        changedByUserId: req.user.id,
        note: "Donation listed.",
      },
    });

    return created;
  });

  res.status(201).json({ message: "Donation listed successfully.", donation });
}

async function getMyDonations(req, res) {
  const { status } = req.query;

  const donations = await prisma.donation.findMany({
    where: {
      donorId: req.user.id,
      ...(status ? { status } : {}),
    },
    include: {
      _count: { select: { requests: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  res.status(200).json({ donations });
}

async function getAvailableDonations(req, res) {
  const { city, foodCategory, foodType, search } = req.query;

  const donations = await prisma.donation.findMany({
    where: {
      status: "AVAILABLE",
      expiresAt: { gt: new Date() },
      ...(city ? { city: { equals: city } } : {}),
      ...(foodCategory ? { foodCategory } : {}),
      ...(foodType ? { foodType } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search } },
              { description: { contains: search } },
            ],
          }
        : {}),
    },
    include: { donor: DONOR_PUBLIC_SELECT },
    orderBy: { createdAt: "desc" },
  });

  res.status(200).json({ donations });
}

async function getDonationById(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: "Invalid donation id." });
  }

  const donation = await prisma.donation.findUnique({
    where: { id },
    include: {
      donor: DONOR_PUBLIC_SELECT,
      history: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!donation) {
    return res.status(404).json({ message: "Donation not found." });
  }

  const isOwner = donation.donorId === req.user.id;
  const isPrivileged = req.user.role === "ADMIN" || req.user.role === "NGO";

  if (!isOwner && !isPrivileged) {
    return res.status(403).json({ message: "You do not have permission to view this donation." });
  }

  let myRequest = null;
  if (req.user.role === "NGO") {
    myRequest = await prisma.donationRequest.findUnique({
      where: { donationId_ngoId: { donationId: id, ngoId: req.user.id } },
    });
  }

  res.status(200).json({ donation: { ...donation, myRequest } });
}

async function updateDonation(req, res) {
  const id = Number(req.params.id);
  const donation = await prisma.donation.findUnique({ where: { id } });

  if (!donation) {
    return res.status(404).json({ message: "Donation not found." });
  }
  if (donation.donorId !== req.user.id) {
    return res.status(403).json({ message: "You can only edit your own donations." });
  }
  if (donation.status !== "AVAILABLE") {
    return res
      .status(409)
      .json({ message: `This donation can no longer be edited (status: ${donation.status}).` });
  }

  const errors = validateDonationInput(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ message: errors[0], errors });
  }

  const {
    title,
    description,
    foodCategory,
    foodType,
    quantity,
    quantityUnit,
    servesApprox,
    preparedAt,
    expiresAt,
    pickupAddress,
    city,
    state,
    pincode,
    imageUrl,
  } = req.body;

  const updated = await prisma.donation.update({
    where: { id },
    data: {
      title: title.trim(),
      description: description.trim(),
      foodCategory,
      foodType,
      quantity: Number(quantity),
      quantityUnit,
      servesApprox: servesApprox ? Number(servesApprox) : null,
      preparedAt: preparedAt ? new Date(preparedAt) : null,
      expiresAt: new Date(expiresAt),
      pickupAddress: pickupAddress.trim(),
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
      imageUrl: imageUrl || null,
    },
  });

  res.status(200).json({ message: "Donation updated.", donation: updated });
}

async function cancelDonation(req, res) {
  const id = Number(req.params.id);
  const donation = await prisma.donation.findUnique({ where: { id } });

  if (!donation) {
    return res.status(404).json({ message: "Donation not found." });
  }
  if (donation.donorId !== req.user.id) {
    return res.status(403).json({ message: "You can only cancel your own donations." });
  }
  if (donation.status !== "AVAILABLE") {
    return res
      .status(409)
      .json({ message: `This donation can no longer be cancelled (status: ${donation.status}).` });
  }

  const updated = await prisma.$transaction(async (tx) => {
    const result = await tx.donation.update({
      where: { id },
      data: { status: "CANCELLED" },
    });

    await tx.donationStatusHistory.create({
      data: {
        donationId: id,
        status: "CANCELLED",
        changedByUserId: req.user.id,
        note: "Cancelled by donor.",
      },
    });

    return result;
  });

  res.status(200).json({ message: "Donation cancelled.", donation: updated });
}

/**
 * Shared implementation for the three forward-only status transitions below.
 * Only the NGO holding the ACCEPTED request for this donation may advance
 * it, and only along the fixed path ACCEPTED -> COLLECTED -> DISTRIBUTED -> COMPLETED.
 */
async function advanceDonationStatus(req, res, { fromStatus, toStatus, note }) {
  const id = Number(req.params.id);

  const donation = await prisma.donation.findUnique({ where: { id } });
  if (!donation) {
    return res.status(404).json({ message: "Donation not found." });
  }
  if (donation.status !== fromStatus) {
    return res
      .status(409)
      .json({ message: `This donation must be ${fromStatus} before it can move to ${toStatus} (currently: ${donation.status}).` });
  }

  const acceptedRequest = await prisma.donationRequest.findFirst({
    where: { donationId: id, status: "ACCEPTED" },
  });
  if (!acceptedRequest || acceptedRequest.ngoId !== req.user.id) {
    return res
      .status(403)
      .json({ message: "Only the NGO whose request was accepted can update this donation's status." });
  }

  const updated = await prisma.$transaction(async (tx) => {
    const result = await tx.donation.update({ where: { id }, data: { status: toStatus } });
    await tx.donationStatusHistory.create({
      data: { donationId: id, status: toStatus, changedByUserId: req.user.id, note },
    });

    if (toStatus === "COMPLETED") {
      await tx.notification.create({
        data: {
          userId: donation.donorId,
          type: "DONATION_COMPLETED",
          title: "Donation completed",
          message: `"${donation.title}" has been marked completed by the collecting NGO.`,
          relatedDonationId: id,
        },
      });
    }

    return result;
  });

  res.status(200).json({ message: `Donation marked ${toStatus.toLowerCase()}.`, donation: updated });
}

async function markCollected(req, res) {
  return advanceDonationStatus(req, res, {
    fromStatus: "ACCEPTED",
    toStatus: "COLLECTED",
    note: "Marked collected by the NGO.",
  });
}

async function markDistributed(req, res) {
  return advanceDonationStatus(req, res, {
    fromStatus: "COLLECTED",
    toStatus: "DISTRIBUTED",
    note: "Marked distributed by the NGO.",
  });
}

async function markCompleted(req, res) {
  return advanceDonationStatus(req, res, {
    fromStatus: "DISTRIBUTED",
    toStatus: "COMPLETED",
    note: "Marked completed by the NGO.",
  });
}

module.exports = {
  createDonation,
  getMyDonations,
  getAvailableDonations,
  getDonationById,
  updateDonation,
  cancelDonation,
  markCollected,
  markDistributed,
  markCompleted,
};
