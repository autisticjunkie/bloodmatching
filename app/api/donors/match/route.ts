// Donor Matching API
// GET /api/donors/match - Find matching donors for a blood request
// POST /api/donors/match - Find donors and create match records

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import {
  findMatchingDonors,
  findAndCreateMatches,
  getCompatibleBloodTypes,
} from "@/lib/matching"

// GET - Find matching donors (preview without creating matches)
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const requestId = searchParams.get("requestId")
    const bloodType = searchParams.get("bloodType")
    const state = searchParams.get("state")
    const city = searchParams.get("city")

    // Build matching criteria
    let targetBloodType = bloodType
    let targetState = state
    let targetCity = city

    // If requestId provided, get details from the request
    if (requestId) {
      const bloodRequest = await prisma.bloodRequest.findUnique({
        where: { id: requestId },
      })

      if (!bloodRequest) {
        return NextResponse.json(
          { success: false, message: "Blood request not found" },
          { status: 404 }
        )
      }

      targetBloodType = bloodRequest.bloodType
      targetState = bloodRequest.hospitalState
      targetCity = bloodRequest.hospitalCity
    }

    if (!targetBloodType || !targetState || !targetCity) {
      return NextResponse.json(
        { success: false, message: "Blood type, state, and city are required" },
        { status: 400 }
      )
    }

    // Get compatible blood types
    const compatibleTypes = getCompatibleBloodTypes(targetBloodType)

    // Find matching donors using the matching service
    const matchingDonors = await findMatchingDonors({
      bloodType: targetBloodType,
      state: targetState,
      city: targetCity,
    })

    // If requestId provided, mark which donors are already matched
    let existingMatches: string[] = []
    if (requestId) {
      const matches = await prisma.match.findMany({
        where: { requestId },
        select: { donorId: true },
      })
      existingMatches = matches.map((m) => m.donorId)
    }

    // Add isAlreadyMatched flag
    const donorsWithMatchStatus = matchingDonors.map((donor) => ({
      ...donor,
      isAlreadyMatched: existingMatches.includes(donor.userId),
    }))

    return NextResponse.json({
      success: true,
      bloodType: targetBloodType,
      compatibleTypes,
      location: {
        state: targetState,
        city: targetCity,
      },
      totalMatches: donorsWithMatchStatus.length,
      donors: donorsWithMatchStatus,
    })
  } catch (error) {
    console.error("Error matching donors:", error)
    return NextResponse.json(
      { success: false, message: "Error finding matching donors" },
      { status: 500 }
    )
  }
}

// POST - Find donors and create match records
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      )
    }

    // Only requesters and admins can trigger matching
    if (user.role !== "requester" && user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Not authorized" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { requestId } = body

    if (!requestId) {
      return NextResponse.json(
        { success: false, message: "Request ID is required" },
        { status: 400 }
      )
    }

    // Verify the request exists and belongs to the user
    const bloodRequest = await prisma.bloodRequest.findUnique({
      where: { id: requestId },
    })

    if (!bloodRequest) {
      return NextResponse.json(
        { success: false, message: "Blood request not found" },
        { status: 404 }
      )
    }

    if (bloodRequest.requesterId !== user.id && user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Not authorized to match this request" },
        { status: 403 }
      )
    }

    // Run the matching logic
    const matchingResult = await findAndCreateMatches(requestId)

    return NextResponse.json({
      ...matchingResult,
      success: true,
      message: `Found ${matchingResult.totalMatchingDonors} matching donors, created ${matchingResult.matchesCreated} new matches`,
    })
  } catch (error) {
    console.error("Error creating matches:", error)
    return NextResponse.json(
      { success: false, message: "Error creating matches" },
      { status: 500 }
    )
  }
}
