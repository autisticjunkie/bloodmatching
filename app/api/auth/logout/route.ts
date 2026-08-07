// POST /api/auth/logout
// Logout and clear session

import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { deleteSession, clearSessionCookie } from "@/lib/auth"

export async function POST() {
  try {
    // Get session token from cookie
    const cookieStore = await cookies()
    const token = cookieStore.get("session")?.value

    // Delete session from database
    if (token) {
      await deleteSession(token)
    }

    // Clear session cookie
    await clearSessionCookie()

    return NextResponse.json({
      success: true,
      message: "Logged out successfully",
    })
  } catch (error) {
    console.error("Logout error:", error)
    // Still clear cookie even if there's an error
    await clearSessionCookie()
    
    return NextResponse.json({
      success: true,
      message: "Logged out",
    })
  }
}
