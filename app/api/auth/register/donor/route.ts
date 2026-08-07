// POST /api/auth/register/donor
// Register a new donor account

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { hashPassword, createSession, setSessionCookie } from "@/lib/auth"
import { validateDonorRegistration } from "@/lib/validations"

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
      bloodType,
      state,
      city,
      gender,
      lastDonationDate,
    } = body

    // Validate input
    const errors = validateDonorRegistration({
      name,
      email,
      phone,
      password,
      confirmPassword,
      bloodType,
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

    // Create user and donor profile in a transaction
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        name,
        phone,
        role: "donor",
        donorProfile: {
          create: {
            bloodType,
            state,
            city,
            gender: gender || null,
            lastDonationDate: lastDonationDate ? new Date(lastDonationDate) : null,
            isAvailable: true,
            isVerified: false,
          },
        },
      },
      include: {
        donorProfile: true,
      },
    })

    // Create session and set cookie
    const token = await createSession(user.id)
    await setSessionCookie(token)

    // Return success response (without password)
    return NextResponse.json({
      success: true,
      message: "Registration successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        donorProfile: user.donorProfile,
      },
    })
  } catch (error) {
    console.error("Donor registration error:", error)
    return NextResponse.json(
      { success: false, message: "An error occurred during registration" },
      { status: 500 }
    )
  }
}
