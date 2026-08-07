import "dotenv/config"
import { PrismaClient } from "../prisma/generated/client"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"
import bcrypt from "bcryptjs"

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL!,
})
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("Initializing database...")

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 10)
  const admin = await prisma.user.upsert({
    where: { email: "admin@lifelink.com" },
    update: {},
    create: {
      email: "admin@lifelink.com",
      passwordHash: adminPassword,
      name: "System Admin",
      phone: "1234567890",
      role: "admin",
      isActive: true,
    },
  })
  console.log("Admin user created:", admin.email)

  // Create sample donor
  const donorPassword = await bcrypt.hash("password123", 10)
  const donor = await prisma.user.upsert({
    where: { email: "donor@example.com" },
    update: {},
    create: {
      email: "donor@example.com",
      passwordHash: donorPassword,
      name: "Chinedu Okafor",
      phone: "0801234567",
      role: "donor",
      isActive: true,
      donorProfile: {
        create: {
          bloodType: "O_POSITIVE",
          state: "Lagos",
          city: "Victoria Island",
          gender: "male",
          isAvailable: true,
          isVerified: true,
          totalDonations: 5,
        },
      },
    },
  })
  console.log("Donor user created:", donor.email)

  // Create sample requester
  const requesterPassword = await bcrypt.hash("password123", 10)
  const requester = await prisma.user.upsert({
    where: { email: "requester@example.com" },
    update: {},
    create: {
      email: "requester@example.com",
      passwordHash: requesterPassword,
      name: "Lagos General Hospital",
      phone: "0809876543",
      role: "requester",
      isActive: true,
      requesterProfile: {
        create: {
          requesterType: "hospital",
          organizationName: "Lagos General Hospital",
          state: "Lagos",
          city: "Victoria Island",
        },
      },
    },
  })
  console.log("Requester user created:", requester.email)

  console.log("Database initialized successfully!")
  console.log("\nTest accounts:")
  console.log("- Admin: admin@lifelink.com / admin123")
  console.log("- Donor: donor@example.com / password123")
  console.log("- Requester: requester@example.com / password123")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
