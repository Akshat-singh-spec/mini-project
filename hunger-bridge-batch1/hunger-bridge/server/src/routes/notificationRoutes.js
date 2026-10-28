const express = require("express");
const { authenticate } = require("../middleware/auth");
const {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} = require("../controllers/notificationController");

const router = express.Router();

router.use(authenticate);

router.get("/mine", getMyNotifications);
router.get("/unread-count", getUnreadCount);
router.patch("/read-all", markAllAsRead);
router.patch("/:id/read", markAsRead);

module.exports = router;
