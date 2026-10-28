import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sprout, UtensilsCrossed, HeartHandshake } from "lucide-react";
import Input from "../../components/Input";
import Select from "../../components/Select";
import Button from "../../components/Button";
import Alert from "../../components/Alert";
import { useAuth } from "../../context/AuthContext";
import { dashboardPathForRole } from "../../utils/roleRouting";

const DONOR_TYPES = [
  { value: "RESTAURANT", label: "Restaurant" },
  { value: "HOTEL", label: "Hotel" },
  { value: "CATERER", label: "Caterer" },
  { value: "EVENT_ORGANIZER", label: "Event organizer" },
  { value: "INDIVIDUAL", label: "Individual" },
  { value: "OTHER", label: "Other" },
];

const INITIAL_FORM = {
  name: "",
  email: "",
  password: "",
  phone: "",
  organizationName: "",
  donorType: "RESTAURANT",
  registrationNumber: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
};

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState("DONOR");
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const payload = {
      name: form.name,
      email: form.email,
      password: form.password,
      phone: form.phone,
      role,
    };

    if (role === "DONOR") {
      payload.donorProfile = {
        organizationName: form.organizationName,
        donorType: form.donorType,
        address: form.address,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
      };
    } else {
      payload.ngoProfile = {
        organizationName: form.organizationName,
        registrationNumber: form.registrationNumber,
        address: form.address,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
      };
    }

    try {
      const data = await register(payload);
      navigate(dashboardPathForRole(data.user.role), { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6 py-16">
      <Link to="/" className="flex items-center gap-2 font-display text-xl text-bridge-800">
        <Sprout className="h-6 w-6 text-bridge-500" />
        Hunger Bridge
      </Link>

      <h1 className="mt-8 font-display text-2xl text-bridge-900">Create your account</h1>
      <p className="mt-1 text-sm text-bridge-600">
        Choose the role that matches what you'll be doing on Hunger Bridge.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => setRole("DONOR")}
          className={`flex flex-col items-start gap-2 rounded-lg border p-4 text-left transition-colors ${
            role === "DONOR" ? "border-bridge-500 bg-bridge-50" : "border-bridge-200 hover:bg-bridge-50/50"
          }`}
        >
          <UtensilsCrossed className="h-5 w-5 text-bridge-600" />
          <span className="text-sm font-semibold text-bridge-900">I'm a donor</span>
          <span className="text-xs text-bridge-600">Restaurant, hotel, caterer, event host</span>
        </button>

        <button
          type="button"
          onClick={() => setRole("NGO")}
          className={`flex flex-col items-start gap-2 rounded-lg border p-4 text-left transition-colors ${
            role === "NGO" ? "border-bridge-500 bg-bridge-50" : "border-bridge-200 hover:bg-bridge-50/50"
          }`}
        >
          <HeartHandshake className="h-5 w-5 text-bridge-600" />
          <span className="text-sm font-semibold text-bridge-900">I'm an NGO</span>
          <span className="text-xs text-bridge-600">Collect and distribute donations</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        {error && <Alert type="error">{error}</Alert>}
        {role === "NGO" && (
          <Alert type="success">
            NGO accounts are reviewed by an admin before you can request donations. You can still
            explore the platform right after registering.
          </Alert>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          <Input id="name" name="name" label="Your full name" value={form.name} onChange={handleChange} required />
          <Input
            id="phone"
            name="phone"
            label="Phone number"
            placeholder="10-digit number"
            value={form.phone}
            onChange={handleChange}
            required
          />
        </div>

        <Input
          id="email"
          name="email"
          type="email"
          label="Email address"
          value={form.email}
          onChange={handleChange}
          autoComplete="email"
          required
        />

        <Input
          id="password"
          name="password"
          type="password"
          label="Password"
          placeholder="At least 8 characters"
          value={form.password}
          onChange={handleChange}
          autoComplete="new-password"
          minLength={8}
          required
        />

        <hr className="border-bridge-100" />

        <Input
          id="organizationName"
          name="organizationName"
          label={role === "DONOR" ? "Business / organization name" : "NGO name"}
          value={form.organizationName}
          onChange={handleChange}
          required
        />

        {role === "DONOR" ? (
          <Select
            id="donorType"
            name="donorType"
            label="Donor type"
            options={DONOR_TYPES}
            value={form.donorType}
            onChange={handleChange}
          />
        ) : (
          <Input
            id="registrationNumber"
            name="registrationNumber"
            label="NGO registration number"
            value={form.registrationNumber}
            onChange={handleChange}
            required
          />
        )}

        <Input id="address" name="address" label="Address" value={form.address} onChange={handleChange} required />

        <div className="grid gap-5 sm:grid-cols-3">
          <Input id="city" name="city" label="City" value={form.city} onChange={handleChange} required />
          <Input id="state" name="state" label="State" value={form.state} onChange={handleChange} required />
          <Input id="pincode" name="pincode" label="Pincode" value={form.pincode} onChange={handleChange} required />
        </div>

        <Button type="submit" isLoading={isSubmitting} className="w-full">
          Create account
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-bridge-600">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-bridge-700 underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
