// Validation utilities for Blood Donor System
// Simple validation functions for form data

// ============================================
// CONSTANTS
// ============================================

export const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const
export const URGENCY_LEVELS = ["low", "medium", "high", "critical"] as const
export const USER_ROLES = ["donor", "requester", "admin"] as const
export const REQUESTER_TYPES = ["individual", "hospital", "clinic", "blood_bank", "ngo"] as const
export const REQUEST_STATUSES = ["active", "fulfilled", "cancelled", "expired"] as const
export const MATCH_STATUSES = ["pending", "accepted", "declined", "completed"] as const

// ============================================
// VALIDATION FUNCTIONS
// ============================================

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate password strength
 * At least 6 characters for MVP simplicity
 */
export function isValidPassword(password: string): boolean {
  return password.length >= 6
}

/**
 * Validate phone number (basic validation)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\-+()]{10,}$/
  return phoneRegex.test(phone)
}

/**
 * Validate blood type
 */
export function isValidBloodType(bloodType: string): boolean {
  return BLOOD_TYPES.includes(bloodType as typeof BLOOD_TYPES[number])
}

/**
 * Validate urgency level
 */
export function isValidUrgency(urgency: string): boolean {
  return URGENCY_LEVELS.includes(urgency as typeof URGENCY_LEVELS[number])
}

/**
 * Validate user role
 */
export function isValidRole(role: string): boolean {
  return USER_ROLES.includes(role as typeof USER_ROLES[number])
}

/**
 * Validate requester type
 */
export function isValidRequesterType(type: string): boolean {
  return REQUESTER_TYPES.includes(type as typeof REQUESTER_TYPES[number])
}

// ============================================
// FORM VALIDATION
// ============================================

export interface ValidationError {
  field: string
  message: string
}

/**
 * Validate donor registration data
 */
export function validateDonorRegistration(data: {
  name?: string
  email?: string
  phone?: string
  password?: string
  confirmPassword?: string
  bloodType?: string
  state?: string
  city?: string
}): ValidationError[] {
  const errors: ValidationError[] = []

  if (!data.name || data.name.length < 2) {
    errors.push({ field: "name", message: "Name must be at least 2 characters" })
  }

  if (!data.email || !isValidEmail(data.email)) {
    errors.push({ field: "email", message: "Please enter a valid email address" })
  }

  if (!data.phone || !isValidPhone(data.phone)) {
    errors.push({ field: "phone", message: "Please enter a valid phone number" })
  }

  if (!data.password || !isValidPassword(data.password)) {
    errors.push({ field: "password", message: "Password must be at least 6 characters" })
  }

  if (data.password !== data.confirmPassword) {
    errors.push({ field: "confirmPassword", message: "Passwords do not match" })
  }

  if (!data.bloodType || !isValidBloodType(data.bloodType)) {
    errors.push({ field: "bloodType", message: "Please select a valid blood type" })
  }

  if (!data.state || data.state.length < 2) {
    errors.push({ field: "state", message: "Please enter your state" })
  }

  if (!data.city || data.city.length < 2) {
    errors.push({ field: "city", message: "Please enter your city" })
  }

  return errors
}

/**
 * Validate requester registration data
 */
export function validateRequesterRegistration(data: {
  name?: string
  email?: string
  phone?: string
  password?: string
  confirmPassword?: string
  requesterType?: string
  organizationName?: string
  state?: string
  city?: string
}): ValidationError[] {
  const errors: ValidationError[] = []

  if (!data.name || data.name.length < 2) {
    errors.push({ field: "name", message: "Name must be at least 2 characters" })
  }

  if (!data.email || !isValidEmail(data.email)) {
    errors.push({ field: "email", message: "Please enter a valid email address" })
  }

  if (!data.phone || !isValidPhone(data.phone)) {
    errors.push({ field: "phone", message: "Please enter a valid phone number" })
  }

  if (!data.password || !isValidPassword(data.password)) {
    errors.push({ field: "password", message: "Password must be at least 6 characters" })
  }

  if (data.password !== data.confirmPassword) {
    errors.push({ field: "confirmPassword", message: "Passwords do not match" })
  }

  if (!data.requesterType || !isValidRequesterType(data.requesterType)) {
    errors.push({ field: "requesterType", message: "Please select a requester type" })
  }

  // Organization name required for non-individual requesters
  if (data.requesterType && data.requesterType !== "individual") {
    if (!data.organizationName || data.organizationName.length < 2) {
      errors.push({ field: "organizationName", message: "Organization name is required" })
    }
  }

  if (!data.state || data.state.length < 2) {
    errors.push({ field: "state", message: "Please enter your state" })
  }

  if (!data.city || data.city.length < 2) {
    errors.push({ field: "city", message: "Please enter your city" })
  }

  return errors
}

/**
 * Validate blood request data
 */
export function validateBloodRequest(data: {
  patientName?: string
  bloodType?: string
  unitsNeeded?: number
  urgency?: string
  hospitalName?: string
  hospitalState?: string
  hospitalCity?: string
  contactPhone?: string
  neededBy?: string
}): ValidationError[] {
  const errors: ValidationError[] = []

  if (!data.patientName || data.patientName.length < 2) {
    errors.push({ field: "patientName", message: "Patient name is required" })
  }

  if (!data.bloodType || !isValidBloodType(data.bloodType)) {
    errors.push({ field: "bloodType", message: "Please select a valid blood type" })
  }

  if (!data.unitsNeeded || data.unitsNeeded < 1) {
    errors.push({ field: "unitsNeeded", message: "At least 1 unit is required" })
  }

  if (!data.urgency || !isValidUrgency(data.urgency)) {
    errors.push({ field: "urgency", message: "Please select urgency level" })
  }

  if (!data.hospitalName || data.hospitalName.length < 2) {
    errors.push({ field: "hospitalName", message: "Hospital name is required" })
  }

  if (!data.hospitalState || data.hospitalState.length < 2) {
    errors.push({ field: "hospitalState", message: "Hospital state is required" })
  }

  if (!data.hospitalCity || data.hospitalCity.length < 2) {
    errors.push({ field: "hospitalCity", message: "Hospital city is required" })
  }

  if (!data.contactPhone || !isValidPhone(data.contactPhone)) {
    errors.push({ field: "contactPhone", message: "Please enter a valid contact phone" })
  }

  if (!data.neededBy) {
    errors.push({ field: "neededBy", message: "Please specify when blood is needed" })
  }

  return errors
}
