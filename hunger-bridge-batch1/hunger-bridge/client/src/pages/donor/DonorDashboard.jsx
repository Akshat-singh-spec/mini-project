import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getMyDonations } from "../../services/donationService";
import DonationCard from "../../components/DonationCard";
import Loader from "../../components/Loader";
import Alert from "../../components/Alert";

export default function DonorDashboard() {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getMyDonations()
      .then(setDonations)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-bridge-900">Welcome, {user?.name}</h1>
          <p className="mt-1 text-sm text-bridge-600">{user?.donorProfile?.organizationName}</p>
        </div>
        <Link to="/donor/donations/new" className="btn-primary">
          <Plus className="h-4 w-4" /> List a donation
        </Link>
      </div>

      <h2 className="mt-10 text-sm font-semibold uppercase tracking-wide text-bridge-500">
        Your donations
      </h2>

      {error && (
        <div className="mt-4">
          <Alert type="error">{error}</Alert>
        </div>
      )}

      {isLoading ? (
        <Loader label="Loading your donations..." />
      ) : donations.length === 0 ? (
        <div className="card mt-4 p-8 text-center">
          <p className="text-bridge-700">You haven't listed any donations yet.</p>
          <Link to="/donor/donations/new" className="btn-primary mt-4 inline-flex">
            List your first donation
          </Link>
        </div>
      ) : (
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {donations.map((donation) => (
            <DonationCard key={donation.id} donation={donation} to={`/donor/donations/${donation.id}`} />
          ))}
        </div>
      )}
    </div>
  );
}
