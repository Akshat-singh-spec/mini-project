const bcrypt = require("bcryptjs");
const prisma = require("../config/db");
const { signToken } = require("../utils/jwt");
const { sanitizeUser } = require("../utils/sanitizeUser");
const { validateRegistration, validateLogin } = require("../validators/authValidators");

async function register(req, res) {
  const errors = validateRegistration(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ message: errors[0], errors });
  }

  const { name, email, password, phone, role } = req.body;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ message: "An account with this email already exists." });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await prisma.$transaction(async (tx) => {
    const createdUser = await tx.user.create({
      data: {
        name,
        email,
        phone,
        role,
        password: hashedPassword,
      },
    });

    if (role === "DONOR") {
      const { organizationName, donorType, address, city, state, pincode } = req.body.donorProfile;
      await tx.donorProfile.create({
        data: {
          userId: createdUser.id,
          organizationName,
          donorType,
          address,
          city,
          state,
          pincode,
        },
      });
    }

    if (role === "NGO") {
      const { organizationName, registrationNumber, address, city, state, pincode } =
        req.body.ngoProfile;
      await tx.ngoProfile.create({
        data: {
          userId: createdUser.id,
          organizationName,
          registrationNumber,
          address,
          city,
          state,
          pincode,
          verificationStatus: "PENDING",
        },
      });
    }

    return tx.user.findUnique({
      where: { id: createdUser.id },
      include: { donorProfile: true, ngoProfile: true },
    });
  });

  const token = signToken({ id: user.id, role: user.role });

  const message =
    role === "NGO"
      ? "Registration successful. Your NGO account is pending verification by an admin."
      : "Registration successful.";

  res.status(201).json({ message, token, user: sanitizeUser(user) });
}

async function login(req, res) {
  const errors = validateLogin(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ message: errors[0], errors });
  }

  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
    include: { donorProfile: true, ngoProfile: true },
  });

  const invalidMessage = "Invalid email or password.";

  if (!user) {
    return res.status(401).json({ message: invalidMessage });
  }
  if (!user.isActive) {
    return res.status(403).json({ message: "This account has been deactivated. Contact the platform admin." });
  }

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    return res.status(401).json({ message: invalidMessage });
  }

  const token = signToken({ id: user.id, role: user.role });

  res.status(200).json({ message: "Login successful.", token, user: sanitizeUser(user) });
}

async function getCurrentUser(req, res) {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: { donorProfile: true, ngoProfile: true },
  });
  res.status(200).json({ user: sanitizeUser(user) });
}

module.exports = { register, login, getCurrentUser };
