// GET /api/auth/session
// Get current user session

import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({
        success: true,
        authenticated: false,
        user: null,
      })
    }

    return NextResponse.json({
      success: true,
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatarUrl: user.avatarUrl,
        donorProfile: user.donorProfile,
        requesterProfile: user.requesterProfile,
      },
    })
  } catch (error) {
    console.error("Session check error:", error)
    return NextResponse.json({
      success: false,
      authenticated: false,
      user: null,
    })
  }
}
