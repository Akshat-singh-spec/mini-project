const prisma = require("../config/db");

const USER_SAFE_SELECT = {
  select: {
    id: true,
    name: true,
    email: true,
    phone: true,
    role: true,
    isActive: true,
    createdAt: true,
    donorProfile: { select: { organizationName: true, donorType: true, city: true } },
    ngoProfile: {
      select: { organizationName: true, registrationNumber: true, city: true, verificationStatus: true },
    },
  },
};

/**
 * GET /api/admin/stats
 * High-level counts for the admin dashboard.
 */
async function getStats(req, res) {
  const [
    totalUsers,
    totalDonors,
    totalNgos,
    pendingNgos,
    approvedNgos,
    totalDonations,
    donationsByStatus,
    totalRequests,
    completedDonations,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "DONOR" } }),
    prisma.user.count({ where: { role: "NGO" } }),
    prisma.ngoProfile.count({ where: { verificationStatus: "PENDING" } }),
    prisma.ngoProfile.count({ where: { verificationStatus: "APPROVED" } }),
    prisma.donation.count(),
    prisma.donation.groupBy({ by: ["status"], _count: { status: true } }),
    prisma.donationRequest.count(),
    prisma.donation.count({ where: { status: "COMPLETED" } }),
  ]);

  const statusBreakdown = donationsByStatus.reduce((acc, row) => {
    acc[row.status] = row._count.status;
    return acc;
  }, {});

  res.status(200).json({
    stats: {
      totalUsers,
      totalDonors,
      totalNgos,
      pendingNgos,
      approvedNgos,
      totalDonations,
      statusBreakdown,
      totalRequests,
      completedDonations,
    },
  });
}

/**
 * GET /api/admin/users
 * All platform users. Optional ?role=DONOR|NGO|ADMIN filter.
 */
async function getUsers(req, res) {
  const { role } = req.query;
  const users = await prisma.user.findMany({
    where: role ? { role } : {},
    ...USER_SAFE_SELECT,
    orderBy: { createdAt: "desc" },
  });
  res.status(200).json({ users });
}

/**
 * GET /api/admin/ngos
 * NGO profiles with their user info. Optional ?status=PENDING|APPROVED|REJECTED filter.
 */
async function getNgos(req, res) {
  const { status } = req.query;
  const ngos = await prisma.ngoProfile.findMany({
    where: status ? { verificationStatus: status } : {},
    include: {
      user: { select: { id: true, name: true, email: true, phone: true, createdAt: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  res.status(200).json({ ngos });
}

/**
 * PATCH /api/admin/ngos/:id/approve
 * Approves an NGO (by NgoProfile id) so it can start requesting donations.
 */
async function approveNgo(req, res) {
  const id = Number(req.params.id);
  const ngoProfile = await prisma.ngoProfile.findUnique({ where: { id } });

  if (!ngoProfile) {
    return res.status(404).json({ message: "NGO profile not found." });
  }

  const updated = await prisma.$transaction(async (tx) => {
    const result = await tx.ngoProfile.update({
      where: { id },
      data: { verificationStatus: "APPROVED", verificationNote: null },
    });

    await tx.notification.create({
      data: {
        userId: ngoProfile.userId,
        type: "NGO_APPROVED",
        title: "Your NGO is verified!",
        message: "An admin approved your NGO account. You can now request donations.",
      },
    });

    return result;
  });

  res.status(200).json({ message: "NGO approved.", ngoProfile: updated });
}

/**
 * PATCH /api/admin/ngos/:id/reject
 * Rejects an NGO application with an optional note explaining why.
 */
async function rejectNgo(req, res) {
  const id = Number(req.params.id);
  const { note } = req.body;
  const ngoProfile = await prisma.ngoProfile.findUnique({ where: { id } });

  if (!ngoProfile) {
    return res.status(404).json({ message: "NGO profile not found." });
  }

  const updated = await prisma.$transaction(async (tx) => {
    const result = await tx.ngoProfile.update({
      where: { id },
      data: { verificationStatus: "REJECTED", verificationNote: note || null },
    });

    await tx.notification.create({
      data: {
        userId: ngoProfile.userId,
        type: "NGO_REJECTED",
        title: "NGO verification not approved",
        message: note
          ? `An admin did not approve your NGO application: ${note}`
          : "An admin did not approve your NGO application. Contact support for details.",
      },
    });

    return result;
  });

  res.status(200).json({ message: "NGO rejected.", ngoProfile: updated });
}

/**
 * GET /api/admin/donations
 * Every donation on the platform, for oversight. Optional ?status= filter.
 */
async function getAllDonations(req, res) {
  const { status } = req.query;
  const donations = await prisma.donation.findMany({
    where: status ? { status } : {},
    include: {
      donor: {
        select: { name: true, donorProfile: { select: { organizationName: true } } },
      },
      _count: { select: { requests: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  res.status(200).json({ donations });
}

module.exports = { getStats, getUsers, getNgos, approveNgo, rejectNgo, getAllDonations };
