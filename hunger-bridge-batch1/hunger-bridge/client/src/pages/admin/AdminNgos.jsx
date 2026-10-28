import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Check, X, ShieldCheck } from "lucide-react";
import { getNgos, approveNgo, rejectNgo } from "../../services/adminService";
import Loader from "../../components/Loader";
import Alert from "../../components/Alert";
import Button from "../../components/Button";
import { formatDateTime } from "../../utils/dateFormat";

const TABS = [
  { value: "", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
];

const STATUS_STYLES = {
  APPROVED: "bg-bridge-50 text-bridge-700 border-bridge-200",
  PENDING: "bg-harvest-50 text-harvest-700 border-harvest-200",
  REJECTED: "bg-clay/10 text-clay border-clay/30",
};

export default function AdminNgos() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeStatus = searchParams.get("status") || "";

  const [ngos, setNgos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actingOnId, setActingOnId] = useState(null);
  const [rejectNoteFor, setRejectNoteFor] = useState(null);
  const [rejectNote, setRejectNote] = useState("");

  useEffect(() => {
    load();
  }, [activeStatus]);

  function load() {
    setIsLoading(true);
    getNgos(activeStatus || undefined)
      .then(setNgos)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }

  async function handleApprove(id) {
    setActingOnId(id);
    try {
      await approveNgo(id);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setActingOnId(null);
    }
  }

  async function handleReject(id) {
    setActingOnId(id);
    try {
      await rejectNgo(id, rejectNote);
      setRejectNoteFor(null);
      setRejectNote("");
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setActingOnId(null);
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-bridge-900">NGO verification</h1>
      <p className="mt-1 text-sm text-bridge-600">Review and approve NGO applications.</p>

      <div className="mt-6 flex gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setSearchParams(tab.value ? { status: tab.value } : {})}
            className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${
              activeStatus === tab.value
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
        <Loader label="Loading NGOs..." />
      ) : ngos.length === 0 ? (
        <div className="card mt-6 flex flex-col items-center gap-2 p-10 text-center">
          <ShieldCheck className="h-6 w-6 text-bridge-400" />
          <p className="text-bridge-700">No NGOs in this category.</p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {ngos.map((ngo) => (
            <div key={ngo.id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display text-lg text-bridge-900">{ngo.organizationName}</p>
                  <p className="text-sm text-bridge-600">{ngo.user.name} · {ngo.user.email}</p>
                  <p className="text-sm text-bridge-600">{ngo.user.phone}</p>
                  <p className="mt-1 text-xs text-bridge-500">
                    Reg. no. {ngo.registrationNumber} · {ngo.city}, {ngo.state} · Applied {formatDateTime(ngo.createdAt)}
                  </p>
                  {ngo.verificationNote && (
                    <p className="mt-2 text-xs text-clay">Note: {ngo.verificationNote}</p>
                  )}
                </div>
                <span className={`rounded border px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[ngo.verificationStatus]}`}>
                  {ngo.verificationStatus}
                </span>
              </div>

              {ngo.verificationStatus === "PENDING" && (
                <div className="mt-4">
                  {rejectNoteFor === ngo.id ? (
                    <div className="space-y-3">
                      <textarea
                        className="input-field min-h-[70px]"
                        placeholder="Optional note explaining the rejection..."
                        value={rejectNote}
                        onChange={(e) => setRejectNote(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <Button variant="secondary" onClick={() => handleReject(ngo.id)} isLoading={actingOnId === ngo.id}>
                          Confirm rejection
                        </Button>
                        <Button variant="secondary" onClick={() => setRejectNoteFor(null)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Button onClick={() => handleApprove(ngo.id)} isLoading={actingOnId === ngo.id}>
                        <Check className="h-4 w-4" /> Approve
                      </Button>
                      <Button variant="secondary" onClick={() => setRejectNoteFor(ngo.id)}>
                        <X className="h-4 w-4" /> Reject
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
