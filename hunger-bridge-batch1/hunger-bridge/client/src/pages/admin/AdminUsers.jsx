import { useEffect, useState } from "react";
import { getUsers } from "../../services/adminService";
import Loader from "../../components/Loader";
import Alert from "../../components/Alert";
import { formatDateTime } from "../../utils/dateFormat";

const TABS = [
  { value: "", label: "All" },
  { value: "DONOR", label: "Donors" },
  { value: "NGO", label: "NGOs" },
  { value: "ADMIN", label: "Admins" },
];

export default function AdminUsers() {
  const [role, setRole] = useState("");
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    getUsers(role || undefined)
      .then(setUsers)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [role]);

  return (
    <div>
      <h1 className="font-display text-2xl text-bridge-900">Users</h1>
      <p className="mt-1 text-sm text-bridge-600">Everyone registered on the platform.</p>

      <div className="mt-6 flex gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setRole(tab.value)}
            className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${
              role === tab.value
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
        <Loader label="Loading users..." />
      ) : (
        <div className="card mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-bridge-100 text-xs uppercase tracking-wide text-bridge-500">
              <tr>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">Organization</th>
                <th className="px-5 py-3">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-bridge-50 last:border-b-0">
                  <td className="px-5 py-3 font-medium text-bridge-900">{u.name}</td>
                  <td className="px-5 py-3 text-bridge-600">{u.email}</td>
                  <td className="px-5 py-3 text-bridge-600">{u.role}</td>
                  <td className="px-5 py-3 text-bridge-600">
                    {u.donorProfile?.organizationName || u.ngoProfile?.organizationName || "—"}
                  </td>
                  <td className="px-5 py-3 text-bridge-500">{formatDateTime(u.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && <p className="px-5 py-8 text-center text-bridge-500">No users found.</p>}
        </div>
      )}
    </div>
  );
}
