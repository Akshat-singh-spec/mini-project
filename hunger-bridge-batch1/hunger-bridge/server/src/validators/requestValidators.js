function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * Validates the payload for an NGO submitting a request on a donation.
 */
function validateRequestInput(body) {
  const errors = [];

  if (!Number.isInteger(Number(body.donationId))) {
    errors.push("A valid donationId is required.");
  }

  if (body.message !== undefined && body.message !== null && body.message !== "") {
    if (typeof body.message !== "string" || body.message.length > 1000) {
      errors.push("Message must be plain text under 1000 characters.");
    }
  }

  return errors;
}

module.exports = { validateRequestInput, isNonEmptyString };
