import { Link } from "react-router-dom";
import { Search, Inbox } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const STATUS_STYLES = {
  APPROVED: "bg-bridge-50 text-bridge-700 border-bridge-200",
  PENDING: "bg-harvest-50 text-harvest-700 border-harvest-200",
  REJECTED: "bg-clay/10 text-clay border-clay/30",
};

export default function NgoDashboard() {
  const { user } = useAuth();
  const status = user?.ngoProfile?.verificationStatus || "PENDING";

  return (
    <div>
      <h1 className="font-display text-2xl text-bridge-900">Welcome, {user?.name}</h1>
      <p className="mt-1 text-sm text-bridge-600">{user?.ngoProfile?.organizationName}</p>

      <div className={`mt-4 inline-block rounded border px-3 py-1 text-xs font-medium ${STATUS_STYLES[status]}`}>
        Verification status: {status}
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="card flex flex-col items-start gap-3 p-6">
          <Search className="h-5 w-5 text-bridge-500" />
          <div>
            <h2 className="font-display text-lg text-bridge-900">Browse donations</h2>
            <p className="mt-1 text-sm text-bridge-600">
              Search and filter every available listing by city, category, and food type.
            </p>
          </div>
          <Link to="/ngo/donations" className="btn-primary mt-2">
            Browse now
          </Link>
        </div>

        <div className="card flex flex-col items-start gap-3 p-6">
          <Inbox className="h-5 w-5 text-bridge-500" />
          <div>
            <h2 className="font-display text-lg text-bridge-900">Your requests</h2>
            <p className="mt-1 text-sm text-bridge-600">
              Track every donation you've requested and what the donor decided.
            </p>
          </div>
          <Link to="/ngo/requests" className="btn-primary mt-2">
            View requests
          </Link>
        </div>
      </div>

      {status === "PENDING" && (
        <div className="card mt-6 p-6">
          <p className="text-sm text-bridge-700">
            Your NGO account is awaiting admin verification. You can browse listings now; you'll be
            able to submit requests once an admin approves your account (admin verification tools
            are being added in a later batch).
          </p>
        </div>
      )}
    </div>
  );
}
