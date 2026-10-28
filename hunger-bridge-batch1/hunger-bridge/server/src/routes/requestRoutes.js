const express = require("express");
const { authenticate, authorize } = require("../middleware/auth");
const {
  createRequest,
  getMyRequests,
  getRequestsForDonation,
  acceptRequest,
  rejectRequest,
  cancelRequest,
} = require("../controllers/requestController");

const router = express.Router();

router.use(authenticate);

// NGO actions
router.post("/", authorize("NGO"), createRequest);
router.get("/mine", authorize("NGO"), getMyRequests);
router.patch("/:id/cancel", authorize("NGO"), cancelRequest);

// Donor actions
router.get("/donation/:donationId", authorize("DONOR"), getRequestsForDonation);
router.patch("/:id/accept", authorize("DONOR"), acceptRequest);
router.patch("/:id/reject", authorize("DONOR"), rejectRequest);

module.exports = router;
