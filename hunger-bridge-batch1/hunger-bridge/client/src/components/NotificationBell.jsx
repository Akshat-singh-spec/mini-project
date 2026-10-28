import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, CheckCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} from "../services/notificationService";
import { formatDateTime } from "../utils/dateFormat";

const POLL_INTERVAL_MS = 20000;

export default function NotificationBell() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasLoadedList, setHasLoadedList] = useState(false);

  // Poll the lightweight unread-count endpoint so the badge stays current
  // even if the dropdown has never been opened.
  useEffect(() => {
    function refreshCount() {
      getUnreadCount()
        .then(setUnreadCount)
        .catch(() => {});
    }
    refreshCount();
    const interval = setInterval(refreshCount, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  // Close the dropdown on an outside click.
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function toggleOpen() {
    const next = !isOpen;
    setIsOpen(next);
    if (next && !hasLoadedList) {
      getMyNotifications()
        .then((list) => {
          setNotifications(list);
          setHasLoadedList(true);
        })
        .catch(() => {});
    }
  }

  async function handleNotificationClick(notification) {
    if (!notification.isRead) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      markAsRead(notification.id).catch(() => {});
    }

    if (notification.relatedDonationId) {
      const base = user?.role === "DONOR" ? "/donor/donations" : "/ngo/donations";
      navigate(`${base}/${notification.relatedDonationId}`);
      setIsOpen(false);
    }
  }

  async function handleMarkAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
    markAllAsRead().catch(() => {});
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={toggleOpen}
        className="relative flex h-9 w-9 items-center justify-center rounded-full text-bridge-700 hover:bg-bridge-50"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-harvest-400 px-1 text-[10px] font-semibold text-bridge-900">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-80 rounded-lg border border-bridge-100 bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-bridge-100 px-4 py-3">
            <p className="text-sm font-semibold text-bridge-900">Notifications</p>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="flex items-center gap-1 text-xs text-bridge-600 hover:text-bridge-800"
              >
                <CheckCheck className="h-3.5 w-3.5" /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-bridge-500">
                {hasLoadedList ? "No notifications yet." : "Loading..."}
              </p>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`block w-full border-b border-bridge-50 px-4 py-3 text-left last:border-b-0 hover:bg-bridge-50 ${
                    n.isRead ? "" : "bg-bridge-50/60"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {!n.isRead && <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-harvest-400" />}
                    <div className={n.isRead ? "pl-3.5" : ""}>
                      <p className="text-sm font-medium text-bridge-900">{n.title}</p>
                      <p className="mt-0.5 text-xs text-bridge-600">{n.message}</p>
                      <p className="mt-1 text-[11px] text-bridge-400">{formatDateTime(n.createdAt)}</p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
