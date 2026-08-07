// Database seed script
// Creates sample data for testing

import "dotenv/config"
import { PrismaClient } from "./generated/client"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"
import bcrypt from "bcryptjs"

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL!,
})
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("Seeding database...")

  // Clear existing data
  await prisma.message.deleteMany()
  await prisma.conversation.deleteMany()
  await prisma.match.deleteMany()
  await prisma.bloodRequest.deleteMany()
  await prisma.session.deleteMany()
  await prisma.donorProfile.deleteMany()
  await prisma.requesterProfile.deleteMany()
  await prisma.user.deleteMany()

  // Create password hash (password: "password123")
  const passwordHash = await bcrypt.hash("password123", 10)

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email: "admin@lifelink.com",
      passwordHash,
      name: "Admin User",
      phone: "555-000-0000",
      role: "admin",
    },
  })
  console.log("Created admin:", admin.email)

  // Create donors
  const donors = await Promise.all([
    prisma.user.create({
      data: {
        email: "john.donor@email.com",
        passwordHash,
        name: "Chinedu Okafor",
        phone: "080-1111-1111",
        role: "donor",
        donorProfile: {
          create: {
            bloodType: "O+",
            state: "Lagos",
            city: "Victoria Island",
            gender: "male",
            isAvailable: true,
            isVerified: true,
            totalDonations: 5,
            lastDonationDate: new Date("2024-01-15"),
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        email: "sarah.donor@email.com",
        passwordHash,
        name: "Amina Bello",
        phone: "080-2222-2222",
        role: "donor",
        donorProfile: {
          create: {
            bloodType: "A+",
            state: "Lagos",
            city: "Ikeja",
            gender: "female",
            isAvailable: true,
            isVerified: true,
            totalDonations: 3,
            lastDonationDate: new Date("2024-02-20"),
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        email: "mike.donor@email.com",
        passwordHash,
        name: "Emeka Nwosu",
        phone: "080-3333-3333",
        role: "donor",
        donorProfile: {
          create: {
            bloodType: "B+",
            state: "FCT Abuja",
            city: "Abuja",
            gender: "male",
            isAvailable: true,
            isVerified: false,
            totalDonations: 0,
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        email: "emily.donor@email.com",
        passwordHash,
        name: "Ngozi Eze",
        phone: "080-4444-4444",
        role: "donor",
        donorProfile: {
          create: {
            bloodType: "O-",
            state: "Lagos",
            city: "Lekki",
            gender: "female",
            isAvailable: false,
            isVerified: true,
            totalDonations: 10,
            lastDonationDate: new Date("2024-03-01"),
          },
        },
      },
    }),
  ])
  console.log(`Created ${donors.length} donors`)

  // Create requesters
  const requesters = await Promise.all([
    prisma.user.create({
      data: {
        email: "hospital.general@email.com",
        passwordHash,
        name: "Dr. Aisha Musa",
        phone: "080-5555-5555",
        role: "requester",
        requesterProfile: {
          create: {
            requesterType: "hospital",
            organizationName: "Lagos General Hospital",
            state: "Lagos",
            city: "Lagos",
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        email: "patient.family@email.com",
        passwordHash,
        name: "Tunde Adeyemi",
        phone: "080-6666-6666",
        role: "requester",
        requesterProfile: {
          create: {
            requesterType: "individual",
            state: "Lagos",
            city: "Ikeja",
          },
        },
      },
    }),
  ])
  console.log(`Created ${requesters.length} requesters`)

  // Create blood requests
  const requests = await Promise.all([
    prisma.bloodRequest.create({
      data: {
        requesterId: requesters[0].id,
        patientName: "Patient A",
        bloodType: "O+",
        unitsNeeded: 2,
        urgency: "high",
        hospitalName: "Lagos General Hospital",
        hospitalState: "Lagos",
        hospitalCity: "Lagos",
        contactPhone: "080-5555-5555",
        neededBy: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        notes: "Surgery scheduled for next week",
        status: "active",
      },
    }),
    prisma.bloodRequest.create({
      data: {
        requesterId: requesters[0].id,
        patientName: "Patient B",
        bloodType: "A+",
        unitsNeeded: 1,
        urgency: "critical",
        hospitalName: "Lagos General Hospital",
        hospitalState: "Lagos",
        hospitalCity: "Lagos",
        contactPhone: "080-5555-5555",
        neededBy: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
        notes: "Emergency case",
        status: "active",
      },
    }),
    prisma.bloodRequest.create({
      data: {
        requesterId: requesters[1].id,
        patientName: "My Father",
        bloodType: "B+",
        unitsNeeded: 3,
        urgency: "medium",
        hospitalName: "National Hospital Abuja",
        hospitalState: "FCT Abuja",
        hospitalCity: "Abuja",
        contactPhone: "080-6666-6666",
        neededBy: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        status: "active",
      },
    }),
  ])
  console.log(`Created ${requests.length} blood requests`)

  // Create some matches
  const match1 = await prisma.match.create({
    data: {
      requestId: requests[0].id,
      donorId: donors[0].id, // John - O+
      status: "accepted",
    },
  })

  const match2 = await prisma.match.create({
    data: {
      requestId: requests[1].id,
      donorId: donors[1].id, // Sarah - A+
      status: "pending",
    },
  })
  console.log("Created 2 matches")

  // Create a conversation for the accepted match
  const conversation = await prisma.conversation.create({
    data: {
      matchId: match1.id,
      participant1Id: requesters[0].id,
      participant2Id: donors[0].id,
    },
  })

  // Create some messages
  await prisma.message.createMany({
    data: [
      {
        conversationId: conversation.id,
        senderId: requesters[0].id,
        receiverId: donors[0].id,
        content: "Hello! Thank you for accepting to donate. When would you be available to come to the hospital?",
        isRead: true,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      },
      {
        conversationId: conversation.id,
        senderId: donors[0].id,
        receiverId: requesters[0].id,
        content: "Hi! I can come tomorrow afternoon. What time works best?",
        isRead: true,
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      },
      {
        conversationId: conversation.id,
        senderId: requesters[0].id,
        receiverId: donors[0].id,
        content: "2 PM would be perfect. Please come to the blood donation center on the 3rd floor.",
        isRead: false,
        createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      },
    ],
  })
  console.log("Created conversation with messages")

  console.log("\n--- Seed Complete ---")
  console.log("\nTest Accounts:")
  console.log("Admin: admin@lifelink.com / password123")
  console.log("Donor: john.donor@email.com / password123")
  console.log("Requester: hospital.general@email.com / password123")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
