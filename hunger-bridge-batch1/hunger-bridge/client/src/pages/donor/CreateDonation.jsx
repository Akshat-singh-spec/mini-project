import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import DonationForm from "../../components/DonationForm";
import { createDonation } from "../../services/donationService";

export default function CreateDonation() {
  const navigate = useNavigate();

  async function handleSubmit(payload) {
    await createDonation(payload);
    navigate("/donor/dashboard", { replace: true });
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link to="/donor/dashboard" className="flex items-center gap-1 text-sm text-bridge-600 hover:text-bridge-800">
        <ArrowLeft className="h-4 w-4" /> Back to dashboard
      </Link>

      <h1 className="mt-4 font-display text-2xl text-bridge-900">List a food donation</h1>
      <p className="mt-1 text-sm text-bridge-600">
        Give NGOs the details they need to decide quickly whether this is a fit for who they serve.
      </p>

      <div className="card mt-6 p-6">
        <DonationForm onSubmit={handleSubmit} submitLabel="List donation" />
      </div>
    </div>
  );
}
