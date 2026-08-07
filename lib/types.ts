// User types
export type UserRole = "donor" | "requester" | "admin"
export type RequesterType = "individual" | "hospital" | "clinic" | "blood_bank" | "ngo"
export type BloodType = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-"
export type UrgencyLevel = "low" | "medium" | "high" | "critical"
export type RequestStatus = "active" | "fulfilled" | "closed" | "expired"
export type DonorStatus = "available" | "unavailable"
export type VerificationStatus = "pending" | "verified" | "rejected"
export type MatchStatus = "pending" | "confirmed" | "declined"

export interface User {
  id: string
  name: string
  email: string
  phone: string
  role: UserRole
  avatar?: string
  state: string
  city: string
  createdAt: string
  isActive: boolean
}

export interface DonorProfile extends User {
  role: "donor"
  bloodType: BloodType
  gender?: "male" | "female" | "other"
  lastDonationDate?: string
  isAvailable: boolean
  isVerified: boolean
  totalDonations: number
}

export interface RequesterProfile extends User {
  role: "requester"
  requesterType: RequesterType
  organizationName?: string
}

export interface BloodRequest {
  id: string
  requesterId: string
  requesterName: string
  patientName: string
  bloodType: BloodType
  unitsNeeded: number
  urgency: UrgencyLevel
  hospitalName: string
  state: string
  city: string
  contactPhone: string
  neededBy: string
  notes?: string
  status: RequestStatus
  matchedDonors: number
  createdAt: string
}

export interface Match {
  id: string
  requestId: string
  donorId: string
  donorName: string
  donorAvatar?: string
  donorBloodType: BloodType
  donorLocation: string
  status: MatchStatus
  createdAt: string
}

export interface Conversation {
  id: string
  participantId: string
  participantName: string
  participantAvatar?: string
  participantRole: "donor" | "requester"
  bloodType?: BloodType
  requestId?: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  isOnline: boolean
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  content: string
  timestamp: string
  isRead: boolean
}

export interface SystemActivity {
  id: string
  type: "match" | "registration" | "request" | "verification" | "fulfilled"
  message: string
  time: string
}
