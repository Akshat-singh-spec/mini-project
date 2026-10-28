import { Link } from "react-router-dom";
import { MapPin, Clock } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { labelFor, FOOD_CATEGORY_OPTIONS, FOOD_TYPE_OPTIONS } from "../utils/donationOptions";
import { formatDateTime } from "../utils/dateFormat";

export default function DonationCard({ donation, to, showStatus = true }) {
  return (
    <Link to={to} className="card block p-5 transition-shadow hover:shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-lg text-bridge-900">{donation.title}</h3>
        {showStatus && <StatusBadge status={donation.status} />}
      </div>

      <p className="mt-2 line-clamp-2 text-sm text-bridge-600">{donation.description}</p>

      <div className="mt-4 flex flex-wrap gap-2 text-xs text-bridge-700">
        <span className="rounded bg-bridge-50 px-2 py-1">{labelFor(FOOD_CATEGORY_OPTIONS, donation.foodCategory)}</span>
        <span className="rounded bg-bridge-50 px-2 py-1">{labelFor(FOOD_TYPE_OPTIONS, donation.foodType)}</span>
        <span className="rounded bg-bridge-50 px-2 py-1">
          {donation.quantity} {donation.quantityUnit.toLowerCase()}
        </span>
      </div>

      <div className="mt-4 flex flex-col gap-1 text-xs text-bridge-500">
        <span className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5" /> {donation.city}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" /> Pickup by {formatDateTime(donation.expiresAt)}
        </span>
      </div>
    </Link>
  );
}
