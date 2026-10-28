import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import Input from "../../components/Input";
import Select from "../../components/Select";
import DonationCard from "../../components/DonationCard";
import Loader from "../../components/Loader";
import Alert from "../../components/Alert";
import { getAvailableDonations } from "../../services/donationService";
import { FOOD_CATEGORY_OPTIONS, FOOD_TYPE_OPTIONS } from "../../utils/donationOptions";

const ANY_OPTION = { value: "", label: "Any" };

export default function BrowseDonations() {
  const [filters, setFilters] = useState({ search: "", city: "", foodCategory: "", foodType: "" });
  const [donations, setDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(true);
      getAvailableDonations(filters)
        .then(setDonations)
        .catch((err) => setError(err.message))
        .finally(() => setIsLoading(false));
    }, 300);
    return () => clearTimeout(timeout);
  }, [filters]);

  function handleFilterChange(e) {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-bridge-900">Browse donations</h1>
      <p className="mt-1 text-sm text-bridge-600">
        Every listing below is currently available and hasn't passed its pickup window.
      </p>

      <div className="card mt-6 grid gap-4 p-5 sm:grid-cols-4">
        <Input
          id="search"
          name="search"
          label="Search"
          placeholder="Title or description"
          value={filters.search}
          onChange={handleFilterChange}
        />
        <Input id="city" name="city" label="City" placeholder="e.g. Greater Noida" value={filters.city} onChange={handleFilterChange} />
        <Select
          id="foodCategory"
          name="foodCategory"
          label="Food category"
          options={[ANY_OPTION, ...FOOD_CATEGORY_OPTIONS]}
          value={filters.foodCategory}
          onChange={handleFilterChange}
        />
        <Select
          id="foodType"
          name="foodType"
          label="Food type"
          options={[ANY_OPTION, ...FOOD_TYPE_OPTIONS]}
          value={filters.foodType}
          onChange={handleFilterChange}
        />
      </div>

      {error && (
        <div className="mt-6">
          <Alert type="error">{error}</Alert>
        </div>
      )}

      {isLoading ? (
        <Loader label="Searching donations..." />
      ) : donations.length === 0 ? (
        <div className="card mt-6 flex flex-col items-center gap-2 p-10 text-center">
          <Search className="h-6 w-6 text-bridge-400" />
          <p className="text-bridge-700">No donations match these filters right now.</p>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {donations.map((donation) => (
            <DonationCard
              key={donation.id}
              donation={donation}
              to={`/ngo/donations/${donation.id}`}
              showStatus={false}
            />
          ))}
        </div>
      )}
    </div>
  );
}
