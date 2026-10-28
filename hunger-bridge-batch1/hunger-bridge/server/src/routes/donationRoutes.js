const express = require("express");
const { authenticate, authorize } = require("../middleware/auth");
const {
  createDonation,
  getMyDonations,
  getAvailableDonations,
  getDonationById,
  updateDonation,
  cancelDonation,
  markCollected,
  markDistributed,
  markCompleted,
} = require("../controllers/donationController");

const router = express.Router();

router.use(authenticate);

// Donor-only management routes.
router.post("/", authorize("DONOR"), createDonation);
router.get("/mine", authorize("DONOR"), getMyDonations);
router.put("/:id", authorize("DONOR"), updateDonation);
router.patch("/:id/cancel", authorize("DONOR"), cancelDonation);

// NGO-only status progression on an accepted donation.
router.patch("/:id/collect", authorize("NGO"), markCollected);
router.patch("/:id/distribute", authorize("NGO"), markDistributed);
router.patch("/:id/complete", authorize("NGO"), markCompleted);

// Browse — any authenticated user (mainly used by NGOs).
router.get("/", getAvailableDonations);
router.get("/:id", getDonationById);

module.exports = router;
