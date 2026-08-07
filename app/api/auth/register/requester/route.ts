// POST /api/auth/register/requester
// Register a new requester account

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { hashPassword, createSession, setSessionCookie } from "@/lib/auth"
import { validateRequesterRegistration } from "@/lib/validations"

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()
    const {
      name,
      email,
      phone,
      password,
      confirmPassword,
      requesterType,
      organizationName,
      state,
      city,
    } = body

    // Validate input
    const errors = validateRequesterRegistration({
      name,
      email,
      phone,
      password,
      confirmPassword,
      requesterType,
      organizationName,
      state,
      city,
    })

    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, errors },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          errors: [{ field: "email", message: "An account with this email already exists" }],
        },
        { status: 400 }
      )
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Create user and requester profile in a transaction
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        name,
        phone,
        role: "requester",
        requesterProfile: {
          create: {
            requesterType,
            organizationName: organizationName || null,
            state,
            city,
          },
        },
      },
      include: {
        requesterProfile: true,
      },
    })

    // Create session and set cookie
    const token = await createSession(user.id)
    await setSessionCookie(token)

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Registration successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        requesterProfile: user.requesterProfile,
      },
    })
  } catch (error) {
    console.error("Requester registration error:", error)
    return NextResponse.json(
      { success: false, message: "An error occurred during registration" },
      { status: 500 }
    )
  }
}
