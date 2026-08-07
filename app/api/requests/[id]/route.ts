// Single Blood Request API Routes
// GET /api/requests/[id] - Get a specific blood request
// PATCH /api/requests/[id] - Update a blood request
// DELETE /api/requests/[id] - Cancel a blood request

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

type RouteParams = { params: Promise<{ id: string }> }

// GET - Fetch a specific blood request
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

    const bloodRequest = await prisma.bloodRequest.findUnique({
      where: { id },
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
    })

    if (!bloodRequest) {
      return NextResponse.json(
        { success: false, message: "Blood request not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      request: bloodRequest,
    })
  } catch (error) {
    console.error("Error fetching request:", error)
    return NextResponse.json(
      { success: false, message: "Error fetching blood request" },
      { status: 500 }
    )
  }
}

// PATCH - Update a blood request
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

    const bloodRequest = await prisma.bloodRequest.findUnique({
      where: { id },
    })

    if (!bloodRequest) {
      return NextResponse.json(
        { success: false, message: "Blood request not found" },
        { status: 404 }
      )
    }

    // Only the requester who created it or admin can update
    if (bloodRequest.requesterId !== user.id && user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Not authorized to update this request" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const updateData: Record<string, unknown> = {}

    // Only allow updating certain fields
    if (body.status) updateData.status = body.status
    if (body.urgency) updateData.urgency = body.urgency
    if (body.notes !== undefined) updateData.notes = body.notes
    if (body.unitsNeeded) updateData.unitsNeeded = parseInt(body.unitsNeeded)

    const updatedRequest = await prisma.bloodRequest.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json({
      success: true,
      message: "Blood request updated",
      request: updatedRequest,
    })
  } catch (error) {
    console.error("Error updating request:", error)
    return NextResponse.json(
      { success: false, message: "Error updating blood request" },
      { status: 500 }
    )
  }
}

// DELETE - Cancel a blood request
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      )
    }

    const bloodRequest = await prisma.bloodRequest.findUnique({
      where: { id },
    })

    if (!bloodRequest) {
      return NextResponse.json(
        { success: false, message: "Blood request not found" },
        { status: 404 }
      )
    }

    // Only the requester who created it or admin can delete
    if (bloodRequest.requesterId !== user.id && user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Not authorized to cancel this request" },
        { status: 403 }
      )
    }

    // Soft delete by setting status to cancelled
    await prisma.bloodRequest.update({
      where: { id },
      data: { status: "cancelled" },
    })

    return NextResponse.json({
      success: true,
      message: "Blood request cancelled",
    })
  } catch (error) {
    console.error("Error cancelling request:", error)
    return NextResponse.json(
      { success: false, message: "Error cancelling blood request" },
      { status: 500 }
    )
  }
}
