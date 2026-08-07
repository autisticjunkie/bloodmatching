// Blood Request API Routes
// GET /api/requests - Get all blood requests (with filters)
// POST /api/requests - Create a new blood request

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { validateBloodRequest } from "@/lib/validations"
import { findAndCreateMatches } from "@/lib/matching"

// GET - Fetch blood requests
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
    const status = searchParams.get("status")
    const bloodType = searchParams.get("bloodType")
    const urgency = searchParams.get("urgency")
    const state = searchParams.get("state")
    const city = searchParams.get("city")

    // Build where clause based on filters
    const where: Record<string, unknown> = {}

    if (status) {
      where.status = status
    }
    if (bloodType) {
      where.bloodType = bloodType
    }
    if (urgency) {
      where.urgency = urgency
    }
    if (state) {
      where.hospitalState = state
    }
    if (city) {
      where.hospitalCity = city
    }

    // If user is a requester, only show their own requests
    if (user.role === "requester") {
      where.requesterId = user.id
    }

    const requests = await prisma.bloodRequest.findMany({
      where,
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            phone: true,
            requesterProfile: true,
          },
        },
        matches: {
          include: {
            donor: {
              select: {
                id: true,
                name: true,
                donorProfile: true,
              },
            },
          },
        },
      },
      orderBy: [
        { urgency: "desc" },
        { createdAt: "desc" },
      ],
    })

    return NextResponse.json({
      success: true,
      requests,
    })
  } catch (error) {
    console.error("Error fetching requests:", error)
    return NextResponse.json(
      { success: false, message: "Error fetching blood requests" },
      { status: 500 }
    )
  }
}

// POST - Create a new blood request
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      )
    }

    // Only requesters and admins can create requests
    if (user.role !== "requester" && user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Only requesters can create blood requests" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      patientName,
      bloodType,
      unitsNeeded,
      urgency,
      hospitalName,
      hospitalState,
      hospitalCity,
      contactPhone,
      neededBy,
      notes,
    } = body

    // Validate input
    const errors = validateBloodRequest({
      patientName,
      bloodType,
      unitsNeeded,
      urgency,
      hospitalName,
      hospitalState,
      hospitalCity,
      contactPhone,
      neededBy,
    })

    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, errors },
        { status: 400 }
      )
    }

    // Create the blood request
    const bloodRequest = await prisma.bloodRequest.create({
      data: {
        requesterId: user.id,
        patientName,
        bloodType,
        unitsNeeded: parseInt(unitsNeeded) || 1,
        urgency,
        hospitalName,
        hospitalState,
        hospitalCity,
        contactPhone,
        neededBy: new Date(neededBy),
        notes: notes || null,
        status: "active",
      },
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
      },
    })

    // Automatically find and create matches with compatible donors
    let matchingResult = null
    try {
      matchingResult = await findAndCreateMatches(bloodRequest.id)
    } catch (matchError) {
      // Log error but don't fail the request creation
      console.error("Error during auto-matching:", matchError)
    }

    return NextResponse.json({
      success: true,
      message: "Blood request created successfully",
      request: bloodRequest,
      matching: matchingResult
        ? {
            totalMatchingDonors: matchingResult.totalMatchingDonors,
            matchesCreated: matchingResult.matchesCreated,
            compatibleBloodTypes: matchingResult.compatibleTypes,
          }
        : null,
    })
  } catch (error) {
    console.error("Error creating request:", error)
    return NextResponse.json(
      { success: false, message: "Error creating blood request" },
      { status: 500 }
    )
  }
}
