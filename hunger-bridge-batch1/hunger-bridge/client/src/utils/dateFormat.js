export function toDatetimeLocalValue(isoOrDate) {
  if (!isoOrDate) return "";
  const date = new Date(isoOrDate);
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
}

export function formatDateTime(isoOrDate) {
  if (!isoOrDate) return "—";
  return new Date(isoOrDate).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
