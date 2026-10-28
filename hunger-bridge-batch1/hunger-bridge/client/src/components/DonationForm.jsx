import { useState } from "react";
import Input from "./Input";
import Select from "./Select";
import Textarea from "./Textarea";
import Button from "./Button";
import Alert from "./Alert";
import { FOOD_CATEGORY_OPTIONS, FOOD_TYPE_OPTIONS, QUANTITY_UNIT_OPTIONS } from "../utils/donationOptions";

const EMPTY_FORM = {
  title: "",
  description: "",
  foodCategory: "VEG",
  foodType: "COOKED_MEAL",
  quantity: "",
  quantityUnit: "PLATES",
  servesApprox: "",
  expiresAt: "",
  pickupAddress: "",
  city: "",
  state: "",
  pincode: "",
  imageUrl: "",
};

export default function DonationForm({ initialValues, onSubmit, submitLabel = "List donation" }) {
  const [form, setForm] = useState({ ...EMPTY_FORM, ...initialValues });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await onSubmit({
        ...form,
        quantity: Number(form.quantity),
        servesApprox: form.servesApprox === "" ? null : Number(form.servesApprox),
        expiresAt: new Date(form.expiresAt).toISOString(),
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <Alert type="error">{error}</Alert>}

      <Input id="title" name="title" label="Title" value={form.title} onChange={handleChange} required />

      <Textarea
        id="description"
        name="description"
        label="Description"
        placeholder="What's included, how it was stored, any handling notes for the collecting NGO..."
        value={form.description}
        onChange={handleChange}
        required
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Select
          id="foodCategory"
          name="foodCategory"
          label="Food category"
          options={FOOD_CATEGORY_OPTIONS}
          value={form.foodCategory}
          onChange={handleChange}
        />
        <Select
          id="foodType"
          name="foodType"
          label="Food type"
          options={FOOD_TYPE_OPTIONS}
          value={form.foodType}
          onChange={handleChange}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <Input
          id="quantity"
          name="quantity"
          type="number"
          min="0.1"
          step="0.1"
          label="Quantity"
          value={form.quantity}
          onChange={handleChange}
          required
        />
        <Select
          id="quantityUnit"
          name="quantityUnit"
          label="Unit"
          options={QUANTITY_UNIT_OPTIONS}
          value={form.quantityUnit}
          onChange={handleChange}
        />
        <Input
          id="servesApprox"
          name="servesApprox"
          type="number"
          min="0"
          label="Approx. servings"
          value={form.servesApprox}
          onChange={handleChange}
        />
      </div>

      <Input
        id="expiresAt"
        name="expiresAt"
        type="datetime-local"
        label="Pickup by (expiry)"
        value={form.expiresAt}
        onChange={handleChange}
        required
      />

      <Input
        id="pickupAddress"
        name="pickupAddress"
        label="Pickup address"
        value={form.pickupAddress}
        onChange={handleChange}
        required
      />

      <div className="grid gap-5 sm:grid-cols-3">
        <Input id="city" name="city" label="City" value={form.city} onChange={handleChange} required />
        <Input id="state" name="state" label="State" value={form.state} onChange={handleChange} required />
        <Input id="pincode" name="pincode" label="Pincode" value={form.pincode} onChange={handleChange} required />
      </div>

      <Input
        id="imageUrl"
        name="imageUrl"
        label="Image URL (optional)"
        placeholder="https://..."
        value={form.imageUrl}
        onChange={handleChange}
      />

      <Button type="submit" isLoading={isSubmitting} className="w-full sm:w-auto">
        {submitLabel}
      </Button>
    </form>
  );
}
