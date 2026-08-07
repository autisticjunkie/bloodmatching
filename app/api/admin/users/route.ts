// Admin Users API
// GET /api/admin/users - Get all users (admin only)

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
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

    const { searchParams } = new URL(request.url)
    const role = searchParams.get("role")
    const verified = searchParams.get("verified")
    const search = searchParams.get("search")

    // Build where clause
    const where: Record<string, unknown> = {}

    if (role) {
      where.role = role
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
      ]
    }

    // Get users
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        avatarUrl: true,
        isActive: true,
        createdAt: true,
        donorProfile: true,
        requesterProfile: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Filter by verification status if specified
    let filteredUsers = users
    if (verified !== null) {
      const isVerified = verified === "true"
      filteredUsers = users.filter((u) => {
        if (u.role === "donor" && u.donorProfile) {
          return u.donorProfile.isVerified === isVerified
        }
        return !isVerified // Non-donors are considered not verified
      })
    }

    // Get counts
    const totalUsers = await prisma.user.count()
    const totalDonors = await prisma.user.count({ where: { role: "donor" } })
    const totalRequesters = await prisma.user.count({ where: { role: "requester" } })
    const verifiedDonors = await prisma.donorProfile.count({ where: { isVerified: true } })
    const pendingVerification = await prisma.donorProfile.count({ where: { isVerified: false } })

    return NextResponse.json({
      success: true,
      users: filteredUsers,
      stats: {
        totalUsers,
        totalDonors,
        totalRequesters,
        verifiedDonors,
        pendingVerification,
      },
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      { success: false, message: "Error fetching users" },
      { status: 500 }
    )
  }
}
