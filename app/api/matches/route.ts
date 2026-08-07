// Matches API Routes
// GET /api/matches - Get matches for current user
// POST /api/matches - Create a new match (connect donor to request)

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

// GET - Fetch matches
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
    const status = searchParams.get("status")

    // Build where clause
    const where: Record<string, unknown> = {}

    // Filter by request if provided
    if (requestId) {
      where.requestId = requestId
    }

    // Filter by status if provided
    if (status) {
      where.status = status
    }

    // If user is a donor, show only their matches
    if (user.role === "donor") {
      where.donorId = user.id
    }

    // If user is a requester, show matches for their requests
    if (user.role === "requester") {
      where.request = {
        requesterId: user.id,
      }
    }

    const matches = await prisma.match.findMany({
      where,
      include: {
        request: {
          include: {
            requester: {
              select: {
                id: true,
                name: true,
                phone: true,
                requesterProfile: true,
              },
            },
          },
        },
        donor: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            donorProfile: true,
          },
        },
        conversation: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({
      success: true,
      matches,
    })
  } catch (error) {
    console.error("Error fetching matches:", error)
    return NextResponse.json(
      { success: false, message: "Error fetching matches" },
      { status: 500 }
    )
  }
}

// POST - Create a new match
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { requestId, donorId } = body

    if (!requestId || !donorId) {
      return NextResponse.json(
        { success: false, message: "Request ID and Donor ID are required" },
        { status: 400 }
      )
    }

    // Verify the blood request exists and belongs to the requester
    const bloodRequest = await prisma.bloodRequest.findUnique({
      where: { id: requestId },
    })

    if (!bloodRequest) {
      return NextResponse.json(
        { success: false, message: "Blood request not found" },
        { status: 404 }
      )
    }

    // Only the requester who created the request or admin can create matches
    if (bloodRequest.requesterId !== user.id && user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Not authorized to create match for this request" },
        { status: 403 }
      )
    }

    // Check if match already exists
    const existingMatch = await prisma.match.findUnique({
      where: {
        requestId_donorId: {
          requestId,
          donorId,
        },
      },
    })

    if (existingMatch) {
      return NextResponse.json(
        { success: false, message: "A match already exists between this donor and request" },
        { status: 400 }
      )
    }

    // Create the match
    const match = await prisma.match.create({
      data: {
        requestId,
        donorId,
        status: "pending",
      },
      include: {
        request: true,
        donor: {
          select: {
            id: true,
            name: true,
            donorProfile: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      message: "Match created successfully",
      match,
    })
  } catch (error) {
    console.error("Error creating match:", error)
    return NextResponse.json(
      { success: false, message: "Error creating match" },
      { status: 500 }
    )
  }
}
