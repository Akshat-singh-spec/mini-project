import api from "./api";

export async function getMyNotifications() {
  const { data } = await api.get("/notifications/mine");
  return data.notifications;
}

export async function getUnreadCount() {
  const { data } = await api.get("/notifications/unread-count");
  return data.count;
}

export async function markAsRead(id) {
  await api.patch(`/notifications/${id}/read`);
}

export async function markAllAsRead() {
  await api.patch("/notifications/read-all");
}
