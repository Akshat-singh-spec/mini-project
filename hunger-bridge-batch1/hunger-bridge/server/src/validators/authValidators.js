const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function validateRegistration(body) {
  const errors = [];
  const { name, email, password, phone, role } = body;

  if (!isNonEmptyString(name)) errors.push("Full name is required.");
  if (!isNonEmptyString(email) || !EMAIL_REGEX.test(email)) {
    errors.push("A valid email address is required.");
  }
  if (!isNonEmptyString(password) || password.length < 8) {
    errors.push("Password must be at least 8 characters long.");
  }
  if (!isNonEmptyString(phone) || !/^\d{10}$/.test(phone)) {
    errors.push("A valid 10-digit phone number is required.");
  }
  if (!["DONOR", "NGO"].includes(role)) {
    errors.push("Role must be either DONOR or NGO.");
  }

  if (role === "DONOR") {
    const profile = body.donorProfile || {};
    if (!isNonEmptyString(profile.organizationName)) {
      errors.push("Organization / individual name is required for donors.");
    }
    if (
      !["RESTAURANT", "HOTEL", "CATERER", "EVENT_ORGANIZER", "INDIVIDUAL", "OTHER"].includes(
        profile.donorType
      )
    ) {
      errors.push("A valid donor type is required.");
    }
    if (!isNonEmptyString(profile.address)) errors.push("Address is required.");
    if (!isNonEmptyString(profile.city)) errors.push("City is required.");
    if (!isNonEmptyString(profile.state)) errors.push("State is required.");
    if (!isNonEmptyString(profile.pincode)) errors.push("Pincode is required.");
  }

  if (role === "NGO") {
    const profile = body.ngoProfile || {};
    if (!isNonEmptyString(profile.organizationName)) {
      errors.push("NGO organization name is required.");
    }
    if (!isNonEmptyString(profile.registrationNumber)) {
      errors.push("NGO registration number is required.");
    }
    if (!isNonEmptyString(profile.address)) errors.push("Address is required.");
    if (!isNonEmptyString(profile.city)) errors.push("City is required.");
    if (!isNonEmptyString(profile.state)) errors.push("State is required.");
    if (!isNonEmptyString(profile.pincode)) errors.push("Pincode is required.");
  }

  return errors;
}

function validateLogin(body) {
  const errors = [];
  if (!isNonEmptyString(body.email) || !EMAIL_REGEX.test(body.email)) {
    errors.push("A valid email address is required.");
  }
  if (!isNonEmptyString(body.password)) {
    errors.push("Password is required.");
  }
  return errors;
}

module.exports = { validateRegistration, validateLogin };
