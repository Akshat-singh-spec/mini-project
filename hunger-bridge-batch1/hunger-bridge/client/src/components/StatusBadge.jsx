import { DONATION_STATUS_STYLES } from "../utils/donationOptions";

export default function StatusBadge({ status }) {
  const style = DONATION_STATUS_STYLES[status] || "bg-bridge-50 text-bridge-700 border-bridge-200";
  return (
    <span className={`inline-block rounded border px-2.5 py-1 text-xs font-medium ${style}`}>
      {status}
    </span>
  );
}
