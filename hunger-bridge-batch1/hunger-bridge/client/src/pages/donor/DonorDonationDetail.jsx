import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Clock, Pencil, Ban, Check, X, Building2 } from "lucide-react";
import StatusBadge from "../../components/StatusBadge";
import Loader from "../../components/Loader";
import Alert from "../../components/Alert";
import Button from "../../components/Button";
import { getDonationById, cancelDonation } from "../../services/donationService";
import { getRequestsForDonation, acceptRequest, rejectRequest } from "../../services/requestService";
import { labelFor, FOOD_CATEGORY_OPTIONS, FOOD_TYPE_OPTIONS } from "../../utils/donationOptions";
import { formatDateTime } from "../../utils/dateFormat";

export default function DonorDonationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [donation, setDonation] = useState(null);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [actingOnId, setActingOnId] = useState(null);

  useEffect(() => {
    loadAll();
  }, [id]);

  async function loadAll() {
    setIsLoading(true);
    try {
      const [donationData, requestData] = await Promise.all([
        getDonationById(id),
        getRequestsForDonation(id),
      ]);
      setDonation(donationData);
      setRequests(requestData);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCancel() {
    if (!window.confirm("Cancel this donation? NGOs will no longer be able to request it.")) return;
    setIsCancelling(true);
    try {
      await cancelDonation(id);
      loadAll();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsCancelling(false);
    }
  }

  async function handleAccept(requestId) {
    if (!window.confirm("Accept this NGO's request? All other pending requests will be rejected.")) return;
    setActingOnId(requestId);
    try {
      await acceptRequest(requestId);
      loadAll();
    } catch (err) {
      setError(err.message);
    } finally {
      setActingOnId(null);
    }
  }

  async function handleReject(requestId) {
    setActingOnId(requestId);
    try {
      await rejectRequest(requestId);
      loadAll();
    } catch (err) {
      setError(err.message);
    } finally {
      setActingOnId(null);
    }
  }

  if (isLoading) return <Loader label="Loading donation..." />;

  const pendingRequests = requests.filter((r) => r.status === "PENDING");
  const decidedRequests = requests.filter((r) => r.status !== "PENDING");

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/donor/dashboard" className="flex items-center gap-1 text-sm text-bridge-600 hover:text-bridge-800">
        <ArrowLeft className="h-4 w-4" /> Back to dashboard
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

          {donation.status === "AVAILABLE" && (
            <div className="mt-6 flex gap-3">
              <Button variant="secondary" onClick={() => navigate(`/donor/donations/${id}/edit`)}>
                <Pencil className="h-4 w-4" /> Edit
              </Button>
              <Button variant="secondary" onClick={handleCancel} isLoading={isCancelling}>
                <Ban className="h-4 w-4" /> Cancel donation
              </Button>
            </div>
          )}

          <div className="card mt-8 p-6">
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

          {/* Incoming requests */}
          <div className="card mt-6 p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-bridge-500">
              Requests ({requests.length})
            </h2>

            {requests.length === 0 ? (
              <p className="mt-3 text-sm text-bridge-600">No NGO has requested this donation yet.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {pendingRequests.map((r) => (
                  <RequestRow
                    key={r.id}
                    request={r}
                    isActing={actingOnId === r.id}
                    onAccept={() => handleAccept(r.id)}
                    onReject={() => handleReject(r.id)}
                  />
                ))}
                {decidedRequests.map((r) => (
                  <RequestRow key={r.id} request={r} />
                ))}
              </div>
            )}
          </div>

          <div className="card mt-6 p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-bridge-500">Status history</h2>
            <ul className="mt-4 space-y-3">
              {donation.history?.map((entry) => (
                <li key={entry.id} className="flex items-start gap-3 text-sm">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-bridge-500" />
                  <div>
                    <p className="font-medium text-bridge-900">{entry.status}</p>
                    <p className="text-bridge-600">{entry.note}</p>
                    <p className="text-xs text-bridge-400">{formatDateTime(entry.createdAt)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

function RequestRow({ request, isActing, onAccept, onReject }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded border border-bridge-100 p-4">
      <div className="flex items-start gap-3">
        <Building2 className="mt-0.5 h-4 w-4 text-bridge-500" />
        <div>
          <p className="text-sm font-medium text-bridge-900">{request.ngo?.ngoProfile?.organizationName}</p>
          {request.message && <p className="mt-1 text-sm text-bridge-600">"{request.message}"</p>}
          <p className="mt-1 text-xs text-bridge-400">{formatDateTime(request.createdAt)}</p>
        </div>
      </div>

      {request.status === "PENDING" && onAccept ? (
        <div className="flex gap-2">
          <Button onClick={onAccept} isLoading={isActing}>
            <Check className="h-4 w-4" /> Accept
          </Button>
          <Button variant="secondary" onClick={onReject} isLoading={isActing}>
            <X className="h-4 w-4" /> Reject
          </Button>
        </div>
      ) : (
        <StatusBadge status={request.status} />
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
