// Donor Matching Service
// Handles the logic for matching blood requests with available donors

import { prisma } from "@/lib/db"

// Blood type compatibility chart
// Key: recipient blood type, Value: compatible donor blood types
export const BLOOD_TYPE_COMPATIBILITY: Record<string, string[]> = {
  "A+": ["A+", "A-", "O+", "O-"],
  "A-": ["A-", "O-"],
  "B+": ["B+", "B-", "O+", "O-"],
  "B-": ["B-", "O-"],
  "AB+": ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], // Universal recipient
  "AB-": ["A-", "B-", "AB-", "O-"],
  "O+": ["O+", "O-"],
  "O-": ["O-"], // Universal donor can only receive O-
}

// Get compatible blood types for a given blood type
export function getCompatibleBloodTypes(bloodType: string): string[] {
  return BLOOD_TYPE_COMPATIBILITY[bloodType] || [bloodType]
}

// Types for matching results
export interface MatchedDonor {
  id: string
  userId: string
  name: string
  avatarUrl: string | null
  bloodType: string
  state: string
  city: string
  isVerified: boolean
  isAvailable: boolean
  totalDonations: number
  lastDonationDate: Date | null
  memberSince: Date
  matchScore: number // Higher score = better match
}

export interface MatchingResult {
  success: boolean
  requestId: string
  bloodType: string
  compatibleTypes: string[]
  location: {
    state: string
    city: string
  }
  totalMatchingDonors: number
  matchesCreated: number
  matchedDonors: MatchedDonor[]
}

// Calculate match score based on various factors
function calculateMatchScore(donor: {
  bloodType: string
  state: string
  city: string
  isVerified: boolean
  totalDonations: number
  lastDonationDate: Date | null
}, request: {
  bloodType: string
  hospitalState: string
  hospitalCity: string
}): number {
  let score = 0

  // Exact blood type match (highest priority)
  if (donor.bloodType === request.bloodType) {
    score += 50
  } else {
    // Compatible but not exact match
    score += 30
  }

  // Same city (highest location priority)
  if (donor.city.toLowerCase() === request.hospitalCity.toLowerCase()) {
    score += 30
  }
  // Same state but different city
  else if (donor.state.toLowerCase() === request.hospitalState.toLowerCase()) {
    score += 15
  }

  // Verified donor bonus
  if (donor.isVerified) {
    score += 10
  }

  // Experience bonus (more donations = more reliable)
  if (donor.totalDonations >= 10) {
    score += 10
  } else if (donor.totalDonations >= 5) {
    score += 5
  } else if (donor.totalDonations >= 1) {
    score += 2
  }

  // Recent donation check (donors who donated recently might not be eligible)
  // This is informational - we still include them but with lower score
  if (donor.lastDonationDate) {
    const daysSinceLastDonation = Math.floor(
      (Date.now() - new Date(donor.lastDonationDate).getTime()) / (1000 * 60 * 60 * 24)
    )
    // If donated less than 56 days ago (8 weeks), lower score
    if (daysSinceLastDonation < 56) {
      score -= 10
    } else {
      score += 5 // Eligible to donate again
    }
  }

  return Math.max(0, score) // Ensure score is never negative
}

// Main matching function - finds donors and creates match records
export async function findAndCreateMatches(requestId: string): Promise<MatchingResult> {
  // Get the blood request
  const bloodRequest = await prisma.bloodRequest.findUnique({
    where: { id: requestId },
  })

  if (!bloodRequest) {
    throw new Error("Blood request not found")
  }

  // Get compatible blood types
  const compatibleTypes = getCompatibleBloodTypes(bloodRequest.bloodType)

  // Find matching donors
  // Priority: Same city > Same state > Compatible blood type
  const matchingDonors = await prisma.donorProfile.findMany({
    where: {
      bloodType: { in: compatibleTypes },
      isAvailable: true,
      user: {
        isActive: true,
        role: "donor",
      },
      // Match by state (city matching done in scoring)
      state: bloodRequest.hospitalState,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
          createdAt: true,
        },
      },
    },
  })

  // If no donors in same state, expand search to all states
  let allMatchingDonors = matchingDonors
  if (matchingDonors.length === 0) {
    allMatchingDonors = await prisma.donorProfile.findMany({
      where: {
        bloodType: { in: compatibleTypes },
        isAvailable: true,
        user: {
          isActive: true,
          role: "donor",
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            createdAt: true,
          },
        },
      },
    })
  }

  // Calculate match scores and sort
  const scoredDonors = allMatchingDonors.map((donor) => ({
    ...donor,
    matchScore: calculateMatchScore(
      {
        bloodType: donor.bloodType,
        state: donor.state,
        city: donor.city,
        isVerified: donor.isVerified,
        totalDonations: donor.totalDonations,
        lastDonationDate: donor.lastDonationDate,
      },
      {
        bloodType: bloodRequest.bloodType,
        hospitalState: bloodRequest.hospitalState,
        hospitalCity: bloodRequest.hospitalCity,
      }
    ),
  }))

  // Sort by match score (highest first)
  scoredDonors.sort((a, b) => b.matchScore - a.matchScore)

  // Get existing matches to avoid duplicates
  const existingMatches = await prisma.match.findMany({
    where: { requestId },
    select: { donorId: true },
  })
  const existingDonorIds = new Set(existingMatches.map((m) => m.donorId))

  // Create match records for new donors (limit to top 20 to avoid spam)
  const donorsToMatch = scoredDonors
    .filter((donor) => !existingDonorIds.has(donor.user.id))
    .slice(0, 20)

  // Create matches in a transaction
  const createdMatches = await prisma.$transaction(
    donorsToMatch.map((donor) =>
      prisma.match.create({
        data: {
          requestId,
          donorId: donor.user.id,
          status: "pending",
        },
      })
    )
  )

  // Format response
  const matchedDonors: MatchedDonor[] = scoredDonors.map((donor) => ({
    id: donor.id,
    userId: donor.user.id,
    name: donor.user.name,
    avatarUrl: donor.user.avatarUrl,
    bloodType: donor.bloodType,
    state: donor.state,
    city: donor.city,
    isVerified: donor.isVerified,
    isAvailable: donor.isAvailable,
    totalDonations: donor.totalDonations,
    lastDonationDate: donor.lastDonationDate,
    memberSince: donor.user.createdAt,
    matchScore: donor.matchScore,
  }))

  return {
    success: true,
    requestId,
    bloodType: bloodRequest.bloodType,
    compatibleTypes,
    location: {
      state: bloodRequest.hospitalState,
      city: bloodRequest.hospitalCity,
    },
    totalMatchingDonors: matchedDonors.length,
    matchesCreated: createdMatches.length,
    matchedDonors,
  }
}

// Find matching donors without creating records (for preview)
export async function findMatchingDonors(params: {
  bloodType: string
  state: string
  city: string
}): Promise<MatchedDonor[]> {
  const { bloodType, state, city } = params
  const compatibleTypes = getCompatibleBloodTypes(bloodType)

  // Find matching donors in same state first
  let matchingDonors = await prisma.donorProfile.findMany({
    where: {
      bloodType: { in: compatibleTypes },
      isAvailable: true,
      state: state,
      user: {
        isActive: true,
        role: "donor",
      },
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
          createdAt: true,
        },
      },
    },
  })

  // If no donors in same state, expand search
  if (matchingDonors.length === 0) {
    matchingDonors = await prisma.donorProfile.findMany({
      where: {
        bloodType: { in: compatibleTypes },
        isAvailable: true,
        user: {
          isActive: true,
          role: "donor",
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            createdAt: true,
          },
        },
      },
    })
  }

  // Calculate scores and sort
  const scoredDonors = matchingDonors.map((donor) => ({
    id: donor.id,
    userId: donor.user.id,
    name: donor.user.name,
    avatarUrl: donor.user.avatarUrl,
    bloodType: donor.bloodType,
    state: donor.state,
    city: donor.city,
    isVerified: donor.isVerified,
    isAvailable: donor.isAvailable,
    totalDonations: donor.totalDonations,
    lastDonationDate: donor.lastDonationDate,
    memberSince: donor.user.createdAt,
    matchScore: calculateMatchScore(
      {
        bloodType: donor.bloodType,
        state: donor.state,
        city: donor.city,
        isVerified: donor.isVerified,
        totalDonations: donor.totalDonations,
        lastDonationDate: donor.lastDonationDate,
      },
      {
        bloodType,
        hospitalState: state,
        hospitalCity: city,
      }
    ),
  }))

  scoredDonors.sort((a, b) => b.matchScore - a.matchScore)

  return scoredDonors
}

// Get match statistics for a request
export async function getMatchStats(requestId: string) {
  const stats = await prisma.match.groupBy({
    by: ["status"],
    where: { requestId },
    _count: { status: true },
  })

  const total = await prisma.match.count({ where: { requestId } })

  return {
    total,
    byStatus: stats.reduce(
      (acc, stat) => {
        acc[stat.status] = stat._count.status
        return acc
      },
      {} as Record<string, number>
    ),
  }
}
