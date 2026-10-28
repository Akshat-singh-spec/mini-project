const express = require("express");
const { authenticate, authorize } = require("../middleware/auth");
const {
  getStats,
  getUsers,
  getNgos,
  approveNgo,
  rejectNgo,
  getAllDonations,
} = require("../controllers/adminController");

const router = express.Router();

router.use(authenticate, authorize("ADMIN"));

router.get("/stats", getStats);
router.get("/users", getUsers);
router.get("/ngos", getNgos);
router.patch("/ngos/:id/approve", approveNgo);
router.patch("/ngos/:id/reject", rejectNgo);
router.get("/donations", getAllDonations);

module.exports = router;
