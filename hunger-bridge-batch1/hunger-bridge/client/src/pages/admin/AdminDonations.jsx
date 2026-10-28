import { useEffect, useState } from "react";
import { getAllDonations } from "../../services/adminService";
import Loader from "../../components/Loader";
import Alert from "../../components/Alert";
import StatusBadge from "../../components/StatusBadge";
import { formatDateTime } from "../../utils/dateFormat";

const TABS = [
  { value: "", label: "All" },
  { value: "AVAILABLE", label: "Available" },
  { value: "REQUESTED", label: "Requested" },
  { value: "ACCEPTED", label: "Accepted" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

export default function AdminDonations() {
  const [status, setStatus] = useState("");
  const [donations, setDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    getAllDonations(status || undefined)
      .then(setDonations)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [status]);

  return (
    <div>
      <h1 className="font-display text-2xl text-bridge-900">All donations</h1>
      <p className="mt-1 text-sm text-bridge-600">Every donation listed on the platform.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatus(tab.value)}
            className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${
              status === tab.value
                ? "bg-bridge-500 text-white"
                : "bg-white text-bridge-700 border border-bridge-200 hover:bg-bridge-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="mt-4">
          <Alert type="error">{error}</Alert>
        </div>
      )}

      {isLoading ? (
        <Loader label="Loading donations..." />
      ) : (
        <div className="card mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-bridge-100 text-xs uppercase tracking-wide text-bridge-500">
              <tr>
                <th className="px-5 py-3">Title</th>
                <th className="px-5 py-3">Donor</th>
                <th className="px-5 py-3">City</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Requests</th>
                <th className="px-5 py-3">Listed</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((d) => (
                <tr key={d.id} className="border-b border-bridge-50 last:border-b-0">
                  <td className="px-5 py-3 font-medium text-bridge-900">{d.title}</td>
                  <td className="px-5 py-3 text-bridge-600">{d.donor?.donorProfile?.organizationName || d.donor?.name}</td>
                  <td className="px-5 py-3 text-bridge-600">{d.city}</td>
                  <td className="px-5 py-3">
                    <StatusBadge status={d.status} />
                  </td>
                  <td className="px-5 py-3 text-bridge-600">{d._count?.requests ?? 0}</td>
                  <td className="px-5 py-3 text-bridge-500">{formatDateTime(d.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {donations.length === 0 && <p className="px-5 py-8 text-center text-bridge-500">No donations found.</p>}
        </div>
      )}
    </div>
  );
}
