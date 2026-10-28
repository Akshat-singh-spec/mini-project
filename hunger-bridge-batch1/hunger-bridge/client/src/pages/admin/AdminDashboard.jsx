import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, Building2, Package, ClipboardList, ShieldCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getStats } from "../../services/adminService";
import Loader from "../../components/Loader";
import Alert from "../../components/Alert";

const STATUS_ORDER = ["AVAILABLE", "REQUESTED", "ACCEPTED", "COLLECTED", "DISTRIBUTED", "COMPLETED", "CANCELLED", "EXPIRED"];

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getStats()
      .then(setStats)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl text-bridge-900">Welcome, {user?.name}</h1>
      <p className="mt-1 text-sm text-bridge-600">Platform overview and moderation tools.</p>

      {error && (
        <div className="mt-4">
          <Alert type="error">{error}</Alert>
        </div>
      )}

      {isLoading ? (
        <Loader label="Loading platform stats..." />
      ) : stats ? (
        <>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={Users} label="Total users" value={stats.totalUsers} />
            <StatCard icon={Building2} label="Donors" value={stats.totalDonors} />
            <StatCard icon={ShieldCheck} label="NGOs (approved)" value={`${stats.approvedNgos} / ${stats.totalNgos}`} />
            <StatCard icon={Package} label="Total donations" value={stats.totalDonations} />
          </div>

          {stats.pendingNgos > 0 && (
            <div className="card mt-6 flex flex-wrap items-center justify-between gap-4 border-harvest-200 bg-harvest-50 p-5">
              <p className="text-sm text-harvest-700">
                <strong>{stats.pendingNgos}</strong> NGO{stats.pendingNgos === 1 ? "" : "s"} waiting on verification.
              </p>
              <Link to="/admin/ngos?status=PENDING" className="btn-accent">
                Review now
              </Link>
            </div>
          )}

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="card p-6">
              <h2 className="font-display text-lg text-bridge-900">Donations by status</h2>
              <div className="mt-4 space-y-2">
                {STATUS_ORDER.filter((s) => stats.statusBreakdown[s]).map((status) => (
                  <div key={status} className="flex items-center justify-between text-sm">
                    <span className="text-bridge-700">{status}</span>
                    <span className="font-medium text-bridge-900">{stats.statusBreakdown[status]}</span>
                  </div>
                ))}
                {Object.keys(stats.statusBreakdown).length === 0 && (
                  <p className="text-sm text-bridge-500">No donations listed yet.</p>
                )}
              </div>
            </div>

            <div className="card p-6">
              <h2 className="font-display text-lg text-bridge-900">Quick links</h2>
              <div className="mt-4 space-y-3">
                <Link to="/admin/ngos" className="flex items-center gap-3 text-sm text-bridge-700 hover:text-bridge-900">
                  <ShieldCheck className="h-4 w-4" /> Manage NGO verification
                </Link>
                <Link to="/admin/users" className="flex items-center gap-3 text-sm text-bridge-700 hover:text-bridge-900">
                  <Users className="h-4 w-4" /> View all users
                </Link>
                <Link to="/admin/donations" className="flex items-center gap-3 text-sm text-bridge-700 hover:text-bridge-900">
                  <ClipboardList className="h-4 w-4" /> View all donations
                </Link>
              </div>
              <p className="mt-4 text-xs text-bridge-500">
                {stats.totalRequests} total request{stats.totalRequests === 1 ? "" : "s"} submitted ·{" "}
                {stats.completedDonations} donation{stats.completedDonations === 1 ? "" : "s"} completed
              </p>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="card p-5">
      <Icon className="h-5 w-5 text-bridge-500" />
      <p className="mt-3 text-2xl font-display text-bridge-900">{value}</p>
      <p className="mt-1 text-xs text-bridge-600">{label}</p>
    </div>
  );
}
