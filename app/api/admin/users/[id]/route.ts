// Admin Single User API
// PATCH /api/admin/users/[id] - Update user (verify, deactivate, etc.)

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

type RouteParams = { params: Promise<{ id: string }> }

// PATCH - Update user (admin actions)
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

    // Only admins can access
    if (user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Admin access required" },
        { status: 403 }
      )
    }

    const targetUser = await prisma.user.findUnique({
      where: { id },
      include: {
        donorProfile: true,
      },
    })

    if (!targetUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { action } = body

    switch (action) {
      case "verify":
        // Verify a donor
        if (targetUser.role !== "donor" || !targetUser.donorProfile) {
          return NextResponse.json(
            { success: false, message: "User is not a donor" },
            { status: 400 }
          )
        }

        await prisma.donorProfile.update({
          where: { userId: id },
          data: { isVerified: true },
        })

        return NextResponse.json({
          success: true,
          message: "Donor verified successfully",
        })

      case "unverify":
        // Remove verification from donor
        if (targetUser.role !== "donor" || !targetUser.donorProfile) {
          return NextResponse.json(
            { success: false, message: "User is not a donor" },
            { status: 400 }
          )
        }

        await prisma.donorProfile.update({
          where: { userId: id },
          data: { isVerified: false },
        })

        return NextResponse.json({
          success: true,
          message: "Donor verification removed",
        })

      case "activate":
        // Activate user account
        await prisma.user.update({
          where: { id },
          data: { isActive: true },
        })

        return NextResponse.json({
          success: true,
          message: "User activated",
        })

      case "deactivate":
        // Deactivate user account
        await prisma.user.update({
          where: { id },
          data: { isActive: false },
        })

        // Also delete their sessions
        await prisma.session.deleteMany({
          where: { userId: id },
        })

        return NextResponse.json({
          success: true,
          message: "User deactivated",
        })

      default:
        return NextResponse.json(
          { success: false, message: "Invalid action" },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json(
      { success: false, message: "Error updating user" },
      { status: 500 }
    )
  }
}
