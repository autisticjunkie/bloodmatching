// Admin Stats API
// GET /api/admin/stats - Get platform statistics (admin only)

import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

export async function GET() {
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

    // Get all statistics
    const [
      totalUsers,
      totalDonors,
      totalRequesters,
      activeRequests,
      fulfilledRequests,
      totalMatches,
      acceptedMatches,
      totalConversations,
      verifiedDonors,
      availableDonors,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "donor" } }),
      prisma.user.count({ where: { role: "requester" } }),
      prisma.bloodRequest.count({ where: { status: "active" } }),
      prisma.bloodRequest.count({ where: { status: "fulfilled" } }),
      prisma.match.count(),
      prisma.match.count({ where: { status: "accepted" } }),
      prisma.conversation.count(),
      prisma.donorProfile.count({ where: { isVerified: true } }),
      prisma.donorProfile.count({ where: { isAvailable: true } }),
    ])

    // Get recent activity
    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    })

    const recentRequests = await prisma.bloodRequest.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        bloodType: true,
        urgency: true,
        hospitalName: true,
        status: true,
        createdAt: true,
        requester: {
          select: {
            name: true,
          },
        },
      },
    })

    // Get blood type distribution of donors
    const bloodTypeDistribution = await prisma.donorProfile.groupBy({
      by: ["bloodType"],
      _count: {
        bloodType: true,
      },
    })

    // Get urgency distribution of active requests
    const urgencyDistribution = await prisma.bloodRequest.groupBy({
      by: ["urgency"],
      where: { status: "active" },
      _count: {
        urgency: true,
      },
    })

    return NextResponse.json({
      success: true,
      stats: {
        users: {
          total: totalUsers,
          donors: totalDonors,
          requesters: totalRequesters,
          verifiedDonors,
          availableDonors,
        },
        requests: {
          active: activeRequests,
          fulfilled: fulfilledRequests,
          total: activeRequests + fulfilledRequests,
        },
        matches: {
          total: totalMatches,
          accepted: acceptedMatches,
        },
        conversations: totalConversations,
        bloodTypeDistribution: bloodTypeDistribution.map((d) => ({
          bloodType: d.bloodType,
          count: d._count.bloodType,
        })),
        urgencyDistribution: urgencyDistribution.map((d) => ({
          urgency: d.urgency,
          count: d._count.urgency,
        })),
      },
      recentActivity: {
        users: recentUsers,
        requests: recentRequests,
      },
    })
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json(
      { success: false, message: "Error fetching statistics" },
      { status: 500 }
    )
  }
}
