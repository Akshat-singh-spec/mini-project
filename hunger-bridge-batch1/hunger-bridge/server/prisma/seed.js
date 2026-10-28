const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();
const DEMO_PASSWORD = "Password123!";

async function hash(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

async function main() {
  const passwordHash = await hash(DEMO_PASSWORD);

  await prisma.user.upsert({
    where: { email: "admin@hungerbridge.com" },
    update: {},
    create: {
      name: "Platform Admin",
      email: "admin@hungerbridge.com",
      password: passwordHash,
      role: "ADMIN",
      phone: "9999999999",
    },
  });

  const donorUser = await prisma.user.upsert({
    where: { email: "donor@hungerbridge.com" },
    update: {},
    create: {
      name: "Ramesh Gupta",
      email: "donor@hungerbridge.com",
      password: passwordHash,
      role: "DONOR",
      phone: "9876500001",
      donorProfile: {
        create: {
          organizationName: "Green Leaf Restaurant",
          donorType: "RESTAURANT",
          address: "12 MG Road",
          city: "Greater Noida",
          state: "Uttar Pradesh",
          pincode: "201310",
        },
      },
    },
  });

  await prisma.user.upsert({
    where: { email: "ngo.approved@hungerbridge.com" },
    update: {},
    create: {
      name: "Anita Sharma",
      email: "ngo.approved@hungerbridge.com",
      password: passwordHash,
      role: "NGO",
      phone: "9876500002",
      ngoProfile: {
        create: {
          organizationName: "Seva Food Foundation",
          registrationNumber: "NGO-REG-1001",
          address: "45 Sector 62",
          city: "Greater Noida",
          state: "Uttar Pradesh",
          pincode: "201301",
          verificationStatus: "APPROVED",
        },
      },
    },
  });

  await prisma.user.upsert({
    where: { email: "ngo.pending@hungerbridge.com" },
    update: {},
    create: {
      name: "Vikram Rao",
      email: "ngo.pending@hungerbridge.com",
      password: passwordHash,
      role: "NGO",
      phone: "9876500003",
      ngoProfile: {
        create: {
          organizationName: "Helping Hands Trust",
          registrationNumber: "NGO-REG-1002",
          address: "9 Alpha 1",
          city: "Greater Noida",
          state: "Uttar Pradesh",
          pincode: "201308",
          verificationStatus: "PENDING",
        },
      },
    },
  });

  const existingDonations = await prisma.donation.count({
    where: { donorId: donorUser.id },
  });

  if (existingDonations === 0) {
    await prisma.donation.createMany({
      data: [
        {
          donorId: donorUser.id,
          title: "Surplus Veg Thali - Wedding Event",
          description:
            "Freshly prepared vegetarian thali meals left over from a wedding function. Packed and refrigerated.",
          foodCategory: "VEG",
          foodType: "COOKED_MEAL",
          quantity: 60,
          quantityUnit: "PLATES",
          servesApprox: 60,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 6),
          pickupAddress: "12 MG Road, Greater Noida",
          city: "Greater Noida",
          state: "Uttar Pradesh",
          pincode: "201310",
          status: "AVAILABLE",
        },
        {
          donorId: donorUser.id,
          title: "Packaged Bakery Items",
          description:
            "Assorted breads and pastries nearing best-before date, still safe to consume.",
          foodCategory: "VEG",
          foodType: "BAKERY",
          quantity: 25,
          quantityUnit: "PACKETS",
          servesApprox: 40,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
          pickupAddress: "12 MG Road, Greater Noida",
          city: "Greater Noida",
          state: "Uttar Pradesh",
          pincode: "201310",
          status: "AVAILABLE",
        },
      ],
    });
  }

  console.log("Seed complete.");
  console.log("--------------------------------------------------");
  console.log("Demo accounts (all use password: " + DEMO_PASSWORD + ")");
  console.log("Admin:          admin@hungerbridge.com");
  console.log("Donor:          donor@hungerbridge.com");
  console.log("Approved NGO:   ngo.approved@hungerbridge.com");
  console.log("Pending NGO:    ngo.pending@hungerbridge.com");
  console.log("--------------------------------------------------");
}

main()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
