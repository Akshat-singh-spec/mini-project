import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Clock, Building2, Send } from "lucide-react";
import StatusBadge from "../../components/StatusBadge";
import Loader from "../../components/Loader";
import Alert from "../../components/Alert";
import Button from "../../components/Button";
import Textarea from "../../components/Textarea";
import { useAuth } from "../../context/AuthContext";
import { getDonationById, markCollected, markDistributed, markCompleted } from "../../services/donationService";
import { createRequest } from "../../services/requestService";
import { labelFor, FOOD_CATEGORY_OPTIONS, FOOD_TYPE_OPTIONS } from "../../utils/donationOptions";
import { formatDateTime } from "../../utils/dateFormat";

const NEXT_STEP = {
  ACCEPTED: { label: "Mark collected", action: markCollected },
  COLLECTED: { label: "Mark distributed", action: markDistributed },
  DISTRIBUTED: { label: "Mark completed", action: markCompleted },
};

export default function NgoDonationDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [donation, setDonation] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [isRequesting, setIsRequesting] = useState(false);
  const [isAdvancing, setIsAdvancing] = useState(false);

  useEffect(() => {
    loadDonation();
  }, [id]);

  function loadDonation() {
    setIsLoading(true);
    getDonationById(id)
      .then(setDonation)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }

  async function handleRequest(e) {
    e.preventDefault();
    setError(null);
    setIsRequesting(true);
    try {
      await createRequest(Number(id), message);
      loadDonation();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsRequesting(false);
    }
  }

  async function handleAdvance(action) {
    setError(null);
    setIsAdvancing(true);
    try {
      await action(id);
      loadDonation();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsAdvancing(false);
    }
  }

  if (isLoading) return <Loader label="Loading donation..." />;

  const isNgoApproved = user?.ngoProfile?.verificationStatus === "APPROVED";
  const myRequest = donation?.myRequest;
  const isMyAcceptedDonation = myRequest?.status === "ACCEPTED";
  const nextStep = isMyAcceptedDonation ? NEXT_STEP[donation.status] : null;

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/ngo/donations" className="flex items-center gap-1 text-sm text-bridge-600 hover:text-bridge-800">
        <ArrowLeft className="h-4 w-4" /> Back to browse
      </Link>

      {error && (
        <div className="mt-6">
          <Alert type="error">{error}</Alert>
        </div>
      )}

      {donation && (
        <div className="mt-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl text-bridge-900">{donation.title}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-bridge-600">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" /> {donation.city}, {donation.state}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" /> Pickup by {formatDateTime(donation.expiresAt)}
                </span>
              </div>
            </div>
            <StatusBadge status={donation.status} />
          </div>

          <div className="card mt-6 flex items-center gap-3 p-4">
            <Building2 className="h-5 w-5 text-bridge-500" />
            <div>
              <p className="text-sm font-medium text-bridge-900">
                {donation.donor?.donorProfile?.organizationName}
              </p>
              <p className="text-xs text-bridge-500">Donor contact: {donation.donor?.phone}</p>
            </div>
          </div>

          <div className="card mt-6 p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-bridge-500">Description</h2>
            <p className="mt-2 whitespace-pre-line text-bridge-800">{donation.description}</p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <DetailRow label="Food category" value={labelFor(FOOD_CATEGORY_OPTIONS, donation.foodCategory)} />
              <DetailRow label="Food type" value={labelFor(FOOD_TYPE_OPTIONS, donation.foodType)} />
              <DetailRow label="Quantity" value={`${donation.quantity} ${donation.quantityUnit.toLowerCase()}`} />
              <DetailRow label="Approx. servings" value={donation.servesApprox ?? "—"} />
              <DetailRow label="Pickup address" value={donation.pickupAddress} />
              <DetailRow label="Pincode" value={donation.pincode} />
            </div>
          </div>

          {/* Request panel */}
          <div className="card mt-6 p-6">
            {myRequest ? (
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-bridge-500">
                  Your request
                </h2>
                <div className="mt-3 flex items-center gap-3">
                  <StatusBadge status={myRequest.status} />
                  <span className="text-sm text-bridge-600">
                    Submitted {formatDateTime(myRequest.createdAt)}
                  </span>
                </div>

                {nextStep && (
                  <Button className="mt-4" onClick={() => handleAdvance(nextStep.action)} isLoading={isAdvancing}>
                    {nextStep.label}
                  </Button>
                )}
              </div>
            ) : !isNgoApproved ? (
              <Alert type="error">
                Your NGO account must be approved by an admin before you can request donations.
              </Alert>
            ) : !["AVAILABLE", "REQUESTED"].includes(donation.status) ? (
              <Alert type="error">This donation is no longer open for requests.</Alert>
            ) : (
              <form onSubmit={handleRequest} className="space-y-4">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-bridge-500">
                  Request this donation
                </h2>
                <Textarea
                  id="message"
                  name="message"
                  label="Message to the donor (optional)"
                  placeholder="Let them know your pickup capacity, timing, or who you'll be distributing to..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <Button type="submit" isLoading={isRequesting}>
                  <Send className="h-4 w-4" /> Submit request
                </Button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-bridge-500">{label}</p>
      <p className="mt-1 text-sm text-bridge-900">{value}</p>
    </div>
  );
}
