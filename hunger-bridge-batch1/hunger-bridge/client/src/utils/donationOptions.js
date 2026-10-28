export const FOOD_CATEGORY_OPTIONS = [
  { value: "VEG", label: "Vegetarian" },
  { value: "NON_VEG", label: "Non-vegetarian" },
  { value: "VEGAN", label: "Vegan" },
  { value: "MIXED", label: "Mixed" },
];

export const FOOD_TYPE_OPTIONS = [
  { value: "COOKED_MEAL", label: "Cooked meal" },
  { value: "RAW_INGREDIENTS", label: "Raw ingredients" },
  { value: "PACKAGED_FOOD", label: "Packaged food" },
  { value: "BAKERY", label: "Bakery" },
  { value: "FRUITS_VEGETABLES", label: "Fruits & vegetables" },
  { value: "DAIRY", label: "Dairy" },
  { value: "BEVERAGES", label: "Beverages" },
  { value: "OTHER", label: "Other" },
];

export const QUANTITY_UNIT_OPTIONS = [
  { value: "KG", label: "Kilograms" },
  { value: "LITERS", label: "Liters" },
  { value: "PLATES", label: "Plates" },
  { value: "PACKETS", label: "Packets" },
  { value: "PIECES", label: "Pieces" },
];

export const DONATION_STATUS_STYLES = {
  AVAILABLE: "bg-bridge-50 text-bridge-700 border-bridge-200",
  REQUESTED: "bg-harvest-50 text-harvest-700 border-harvest-200",
  ACCEPTED: "bg-harvest-50 text-harvest-700 border-harvest-200",
  COLLECTED: "bg-bridge-50 text-bridge-700 border-bridge-200",
  DISTRIBUTED: "bg-bridge-50 text-bridge-700 border-bridge-200",
  COMPLETED: "bg-bridge-100 text-bridge-800 border-bridge-300",
  CANCELLED: "bg-clay/10 text-clay border-clay/30",
  EXPIRED: "bg-clay/10 text-clay border-clay/30",
};

export function labelFor(options, value) {
  return options.find((opt) => opt.value === value)?.label || value;
}
