// Authentication utilities for Blood Donor System
// Simple session-based auth suitable for a school project

import { cookies } from "next/headers"
import { prisma } from "./db"
import bcrypt from "bcryptjs"

// ============================================
// PASSWORD UTILITIES
// ============================================

/**
 * Hash a password using bcrypt
 * @param password - Plain text password
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10
  return bcrypt.hash(password, saltRounds)
}

/**
 * Compare a plain password with a hashed password
 * @param password - Plain text password
 * @param hash - Hashed password
 * @returns True if passwords match
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// ============================================
// SESSION UTILITIES
// ============================================

/**
 * Generate a random session token
 * @returns Random token string
 */
export function generateSessionToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("")
}

/**
 * Create a new session for a user
 * @param userId - User ID to create session for
 * @returns Session token
 */
export async function createSession(userId: string): Promise<string> {
  const token = generateSessionToken()
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

  await prisma.session.create({
    data: {
      userId,
      token,
      expiresAt,
    },
  })

  return token
}

/**
 * Set session cookie
 * @param token - Session token
 */
export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: "/",
  })
}

/**
 * Get session from cookie
 * @returns Session with user data or null
 */
export async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get("session")?.value

  if (!token) {
    return null
  }

  const session = await prisma.session.findUnique({
    where: { token },
    include: {
      user: {
        include: {
          donorProfile: true,
          requesterProfile: true,
        },
      },
    },
  })

  // Check if session exists and is not expired
  if (!session || session.expiresAt < new Date()) {
    // Clean up expired session
    if (session) {
      await prisma.session.delete({ where: { id: session.id } })
    }
    return null
  }

  return session
}

/**
 * Get current user from session
 * @returns User data or null
 */
export async function getCurrentUser() {
  const session = await getSession()
  return session?.user ?? null
}

/**
 * Delete session (logout)
 * @param token - Session token to delete
 */
export async function deleteSession(token: string): Promise<void> {
  await prisma.session.delete({ where: { token } }).catch(() => {
    // Ignore errors if session doesn't exist
  })
}

/**
 * Clear session cookie
 */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete("session")
}

// ============================================
// AUTH CHECK UTILITIES
// ============================================

/**
 * Check if user is authenticated
 * @returns True if user has valid session
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession()
  return session !== null
}

/**
 * Check if user has specific role
 * @param role - Role to check for
 * @returns True if user has the role
 */
export async function hasRole(role: string): Promise<boolean> {
  const user = await getCurrentUser()
  return user?.role === role
}

/**
 * Require authentication - throws if not authenticated
 * @returns User data
 */
export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error("Authentication required")
  }
  return user
}

/**
 * Require specific role - throws if user doesn't have role
 * @param role - Required role
 * @returns User data
 */
export async function requireRole(role: string) {
  const user = await requireAuth()
  if (user.role !== role) {
    throw new Error(`Role '${role}' required`)
  }
  return user
}
