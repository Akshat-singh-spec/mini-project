const FOOD_CATEGORIES = ["VEG", "NON_VEG", "VEGAN", "MIXED"];
const FOOD_TYPES = [
  "COOKED_MEAL",
  "RAW_INGREDIENTS",
  "PACKAGED_FOOD",
  "BAKERY",
  "FRUITS_VEGETABLES",
  "DAIRY",
  "BEVERAGES",
  "OTHER",
];
const QUANTITY_UNITS = ["KG", "LITERS", "PLATES", "PACKETS", "PIECES"];

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function validateDonationInput(body) {
  const errors = [];

  if (!isNonEmptyString(body.title)) errors.push("Title is required.");
  if (!isNonEmptyString(body.description)) errors.push("Description is required.");

  if (!FOOD_CATEGORIES.includes(body.foodCategory)) {
    errors.push(`Food category must be one of: ${FOOD_CATEGORIES.join(", ")}.`);
  }
  if (!FOOD_TYPES.includes(body.foodType)) {
    errors.push(`Food type must be one of: ${FOOD_TYPES.join(", ")}.`);
  }
  if (!QUANTITY_UNITS.includes(body.quantityUnit)) {
    errors.push(`Quantity unit must be one of: ${QUANTITY_UNITS.join(", ")}.`);
  }

  const quantity = Number(body.quantity);
  if (!Number.isFinite(quantity) || quantity <= 0) {
    errors.push("Quantity must be a positive number.");
  }

  if (body.servesApprox !== undefined && body.servesApprox !== null && body.servesApprox !== "") {
    const serves = Number(body.servesApprox);
    if (!Number.isFinite(serves) || serves < 0) {
      errors.push("Approximate servings must be a non-negative number.");
    }
  }

  if (!isNonEmptyString(body.expiresAt) || Number.isNaN(Date.parse(body.expiresAt))) {
    errors.push("A valid pickup-by / expiry date and time is required.");
  } else if (new Date(body.expiresAt).getTime() <= Date.now()) {
    errors.push("Expiry date and time must be in the future.");
  }

  if (!isNonEmptyString(body.pickupAddress)) errors.push("Pickup address is required.");
  if (!isNonEmptyString(body.city)) errors.push("City is required.");
  if (!isNonEmptyString(body.state)) errors.push("State is required.");
  if (!isNonEmptyString(body.pincode)) errors.push("Pincode is required.");

  return errors;
}

module.exports = { validateDonationInput, FOOD_CATEGORIES, FOOD_TYPES, QUANTITY_UNITS };
