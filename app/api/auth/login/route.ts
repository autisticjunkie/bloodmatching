// POST /api/auth/login
// Login with email and password

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { verifyPassword, createSession, setSessionCookie } from "@/lib/auth"
import { isValidEmail } from "@/lib/validations"

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()
    const { email, password, rememberMe } = body

    // Basic validation
    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid email address" },
        { status: 400 }
      )
    }

    if (!password) {
      return NextResponse.json(
        { success: false, message: "Please enter your password" },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        donorProfile: true,
        requesterProfile: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      )
    }

    // Check if account is active
    if (!user.isActive) {
      return NextResponse.json(
        { success: false, message: "Your account has been deactivated" },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.passwordHash)
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      )
    }

    // Create session and set cookie
    const token = await createSession(user.id)
    await setSessionCookie(token)

    // Return user data (without sensitive info)
    return NextResponse.json({
      success: true,
      message: "Login successful",
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
    console.error("Login error:", error)
    return NextResponse.json(
      { success: false, message: "An error occurred during login" },
      { status: 500 }
    )
  }
}
