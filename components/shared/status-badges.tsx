import { Badge } from "@/components/ui/badge"
import type { UrgencyLevel, RequestStatus, MatchStatus, UserRole, VerificationStatus } from "@/lib/types"

export function UrgencyBadge({ urgency }: { urgency: UrgencyLevel }) {
  switch (urgency) {
    case "critical":
      return <Badge className="bg-red-600 text-white hover:bg-red-600">Critical</Badge>
    case "high":
      return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Urgent</Badge>
    case "medium":
      return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Medium</Badge>
    case "low":
      return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Normal</Badge>
    default:
      return <Badge variant="secondary">Unknown</Badge>
  }
}

export function RequestStatusBadge({ status }: { status: RequestStatus }) {
  switch (status) {
    case "active":
      return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>
    case "fulfilled":
      return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Fulfilled</Badge>
    case "closed":
      return <Badge variant="outline">Closed</Badge>
    case "expired":
      return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">Expired</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export function MatchStatusBadge({ status }: { status: MatchStatus }) {
  switch (status) {
    case "confirmed":
      return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Confirmed</Badge>
    case "pending":
      return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Pending</Badge>
    case "declined":
      return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Declined</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export function RoleBadge({ role }: { role: UserRole }) {
  switch (role) {
    case "donor":
      return <Badge className="bg-primary/10 text-primary hover:bg-primary/10">Donor</Badge>
    case "requester":
      return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Requester</Badge>
    case "admin":
      return <Badge className="bg-gray-900 text-white hover:bg-gray-900">Admin</Badge>
    default:
      return <Badge variant="secondary">{role}</Badge>
  }
}

export function VerificationBadge({ status }: { status: VerificationStatus }) {
  switch (status) {
    case "verified":
      return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Verified</Badge>
    case "pending":
      return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Pending</Badge>
    case "rejected":
      return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Rejected</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export function AvailabilityBadge({ isAvailable }: { isAvailable: boolean }) {
  return isAvailable ? (
    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Available</Badge>
  ) : (
    <Badge variant="outline">Unavailable</Badge>
  )
}
