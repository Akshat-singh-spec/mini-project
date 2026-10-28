import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import DonationForm from "../../components/DonationForm";
import Loader from "../../components/Loader";
import Alert from "../../components/Alert";
import { getDonationById, updateDonation } from "../../services/donationService";
import { toDatetimeLocalValue } from "../../utils/dateFormat";

export default function EditDonation() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [donation, setDonation] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getDonationById(id)
      .then(setDonation)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [id]);

  async function handleSubmit(payload) {
    await updateDonation(id, payload);
    navigate("/donor/dashboard", { replace: true });
  }

  if (isLoading) return <Loader label="Loading donation..." />;

  return (
    <div className="mx-auto max-w-2xl">
      <Link to="/donor/dashboard" className="flex items-center gap-1 text-sm text-bridge-600 hover:text-bridge-800">
        <ArrowLeft className="h-4 w-4" /> Back to dashboard
      </Link>

      <h1 className="mt-4 font-display text-2xl text-bridge-900">Edit donation</h1>

      {error && (
        <div className="mt-6">
          <Alert type="error">{error}</Alert>
        </div>
      )}

      {donation && donation.status !== "AVAILABLE" && (
        <div className="mt-6">
          <Alert type="error">
            This donation is no longer editable (status: {donation.status}).
          </Alert>
        </div>
      )}

      {donation && donation.status === "AVAILABLE" && (
        <div className="card mt-6 p-6">
          <DonationForm
            initialValues={{
              ...donation,
              quantity: String(donation.quantity),
              servesApprox: donation.servesApprox ? String(donation.servesApprox) : "",
              expiresAt: toDatetimeLocalValue(donation.expiresAt),
              imageUrl: donation.imageUrl || "",
            }}
            onSubmit={handleSubmit}
            submitLabel="Save changes"
          />
        </div>
      )}
    </div>
  );
}
