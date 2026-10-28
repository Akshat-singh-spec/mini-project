const prisma = require("../config/db");

/**
 * GET /api/notifications/mine
 * The logged-in user's notifications, most recent first. Capped at 50 so
 * the dropdown stays fast — this isn't meant to be a full archive view.
 */
async function getMyNotifications(req, res) {
  const notifications = await prisma.notification.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  res.status(200).json({ notifications });
}

/**
 * GET /api/notifications/unread-count
 * Lightweight endpoint the UI can poll for the bell's badge count.
 */
async function getUnreadCount(req, res) {
  const count = await prisma.notification.count({
    where: { userId: req.user.id, isRead: false },
  });
  res.status(200).json({ count });
}

/**
 * PATCH /api/notifications/:id/read
 * Marks a single notification as read. Scoped to the owning user so one
 * account can never mark another account's notifications.
 */
async function markAsRead(req, res) {
  const id = Number(req.params.id);

  const result = await prisma.notification.updateMany({
    where: { id, userId: req.user.id },
    data: { isRead: true },
  });

  if (result.count === 0) {
    return res.status(404).json({ message: "Notification not found." });
  }

  res.status(200).json({ message: "Marked as read." });
}

/**
 * PATCH /api/notifications/read-all
 * Marks every unread notification for the logged-in user as read.
 */
async function markAllAsRead(req, res) {
  await prisma.notification.updateMany({
    where: { userId: req.user.id, isRead: false },
    data: { isRead: true },
  });
  res.status(200).json({ message: "All notifications marked as read." });
}

module.exports = { getMyNotifications, getUnreadCount, markAsRead, markAllAsRead };
