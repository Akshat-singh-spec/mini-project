import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Inbox } from "lucide-react";
import { getMyRequests, cancelRequest } from "../../services/requestService";
import StatusBadge from "../../components/StatusBadge";
import Loader from "../../components/Loader";
import Alert from "../../components/Alert";
import Button from "../../components/Button";
import { formatDateTime } from "../../utils/dateFormat";

export default function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    load();
  }, []);

  function load() {
    setIsLoading(true);
    getMyRequests()
      .then(setRequests)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }

  async function handleCancel(requestId) {
    setCancellingId(requestId);
    try {
      await cancelRequest(requestId);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setCancellingId(null);
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-bridge-900">Your requests</h1>
      <p className="mt-1 text-sm text-bridge-600">Every donation you've requested, and its current status.</p>

      {error && (
        <div className="mt-4">
          <Alert type="error">{error}</Alert>
        </div>
      )}

      {isLoading ? (
        <Loader label="Loading your requests..." />
      ) : requests.length === 0 ? (
        <div className="card mt-6 flex flex-col items-center gap-2 p-10 text-center">
          <Inbox className="h-6 w-6 text-bridge-400" />
          <p className="text-bridge-700">You haven't requested any donations yet.</p>
          <Link to="/ngo/donations" className="btn-primary mt-2 inline-flex">
            Browse donations
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {requests.map((request) => (
            <div key={request.id} className="card flex flex-wrap items-center justify-between gap-4 p-5">
              <div>
                <Link
                  to={`/ngo/donations/${request.donation.id}`}
                  className="font-display text-lg text-bridge-900 hover:underline"
                >
                  {request.donation.title}
                </Link>
                <p className="mt-1 text-sm text-bridge-600">
                  {request.donation.city} · Requested {formatDateTime(request.createdAt)}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <StatusBadge status={request.status} />
                {request.status === "PENDING" && (
                  <Button
                    variant="secondary"
                    onClick={() => handleCancel(request.id)}
                    isLoading={cancellingId === request.id}
                  >
                    Withdraw
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
