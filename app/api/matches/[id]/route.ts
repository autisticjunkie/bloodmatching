// Single Match API Routes
// GET /api/matches/[id] - Get a specific match
// PATCH /api/matches/[id] - Update match status (accept/decline)

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

type RouteParams = { params: Promise<{ id: string }> }

// GET - Fetch a specific match
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      )
    }

    const match = await prisma.match.findUnique({
      where: { id },
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
            phone: true,
            donorProfile: true,
          },
        },
        conversation: {
          select: {
            id: true,
          },
        },
      },
    })

    if (!match) {
      return NextResponse.json(
        { success: false, message: "Match not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      match,
    })
  } catch (error) {
    console.error("Error fetching match:", error)
    return NextResponse.json(
      { success: false, message: "Error fetching match" },
      { status: 500 }
    )
  }
}

// PATCH - Update match status
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      )
    }

    const match = await prisma.match.findUnique({
      where: { id },
      include: {
        request: true,
      },
    })

    if (!match) {
      return NextResponse.json(
        { success: false, message: "Match not found" },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { status } = body

    // Validate status
    const validStatuses = ["pending", "accepted", "declined", "completed"]
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status" },
        { status: 400 }
      )
    }

    // Only the donor can accept/decline, only requester can mark complete
    if (status === "accepted" || status === "declined") {
      if (match.donorId !== user.id) {
        return NextResponse.json(
          { success: false, message: "Only the donor can accept or decline" },
          { status: 403 }
        )
      }
    }

    if (status === "completed") {
      if (match.request.requesterId !== user.id && user.role !== "admin") {
        return NextResponse.json(
          { success: false, message: "Only the requester can mark as completed" },
          { status: 403 }
        )
      }
    }

    // Update the match
    const updatedMatch = await prisma.match.update({
      where: { id },
      data: { status },
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

    // If match is completed, increment donor's total donations
    if (status === "completed") {
      await prisma.donorProfile.update({
        where: { userId: match.donorId },
        data: {
          totalDonations: { increment: 1 },
          lastDonationDate: new Date(),
        },
      })
    }

    return NextResponse.json({
      success: true,
      message: `Match ${status}`,
      match: updatedMatch,
    })
  } catch (error) {
    console.error("Error updating match:", error)
    return NextResponse.json(
      { success: false, message: "Error updating match" },
      { status: 500 }
    )
  }
}
