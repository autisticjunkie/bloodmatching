"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { StatCard } from "@/components/shared/stat-card"
import { UrgencyBadge, MatchStatusBadge } from "@/components/shared/status-badges"
import { EmptyState } from "@/components/shared/empty-state"
import { PageHeader } from "@/components/shared/page-header"
import {
  Droplet,
  CheckCircle2,
  FileHeart,
  MessageSquare,
  MapPin,
  Clock,
  AlertCircle,
  User,
  ChevronRight,
} from "lucide-react"
import type { UrgencyLevel, MatchStatus } from "@/lib/types"

// Mock data for demonstration
const donorData = {
  name: "Chinedu Okafor",
  email: "chinedu.okafor@email.com",
  bloodType: "O+",
  location: "Victoria Island, Lagos",
  lastDonation: "2024-01-15",
  isAvailable: true,
  isVerified: true,
}

const statsData = {
  matchedRequests: 5,
  unreadMessages: 3,
  totalDonations: 8,
}

const recentRequests = [
  {
    id: 1,
    requesterName: "Lagos University Teaching Hospital",
    bloodType: "O+",
    urgency: "high" as UrgencyLevel,
    location: "Lagos",
    postedAt: "2 hours ago",
    status: "pending" as MatchStatus,
  },
  {
    id: 2,
    requesterName: "Amina Bello",
    bloodType: "O+",
    urgency: "medium" as UrgencyLevel,
    location: "Ikeja",
    postedAt: "5 hours ago",
    status: "pending" as MatchStatus,
  },
  {
    id: 3,
    requesterName: "National Hospital Abuja",
    bloodType: "O+",
    urgency: "low" as UrgencyLevel,
    location: "Abuja",
    postedAt: "1 day ago",
    status: "confirmed" as MatchStatus,
  },
]

export default function DonorDashboardPage() {
  const [isAvailable, setIsAvailable] = useState(donorData.isAvailable)

  return (
    <>
      <PageHeader
        title={`Welcome back, ${donorData.name.split(" ")[0]}`}
        description="Here's an overview of your donor activity"
      />

      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Blood Type"
          value={donorData.bloodType}
          icon={Droplet}
        />

        {/* Availability Card with Toggle */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-full ${isAvailable ? "bg-green-100" : "bg-muted"}`}>
                  <CheckCircle2 className={`h-6 w-6 ${isAvailable ? "text-green-600" : "text-muted-foreground"}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Availability</p>
                  <p className={`text-lg font-semibold ${isAvailable ? "text-green-600" : "text-muted-foreground"}`}>
                    {isAvailable ? "Available" : "Unavailable"}
                  </p>
                </div>
              </div>
              <Switch checked={isAvailable} onCheckedChange={setIsAvailable} />
            </div>
          </CardContent>
        </Card>

        <StatCard
          title="Matched Requests"
          value={statsData.matchedRequests}
          icon={FileHeart}
        />

        <StatCard
          title="Unread Messages"
          value={statsData.unreadMessages}
          icon={MessageSquare}
          href="/chat"
          badge={statsData.unreadMessages}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Matched Requests */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Matching Requests</CardTitle>
                  <CardDescription>Blood requests that match your profile</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/donor/requests">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {recentRequests.length > 0 ? (
                <div className="divide-y divide-border">
                  {recentRequests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-4 transition-colors hover:bg-muted/50">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <Droplet className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{request.requesterName}</p>
                          <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5" />
                              {request.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {request.postedAt}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col items-end gap-1">
                          <UrgencyBadge urgency={request.urgency} />
                          <MatchStatusBadge status={request.status} />
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={AlertCircle}
                  title="No matching requests found"
                  description="Check back later for new requests"
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Profile Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="border-b">
              <CardTitle>Profile Summary</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="/images/donor-portrait-1.jpg" alt={donorData.name} />
                  <AvatarFallback className="text-lg">
                    {donorData.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <h3 className="mt-4 text-lg font-semibold text-foreground">{donorData.name}</h3>
                <p className="text-sm text-muted-foreground">{donorData.email}</p>
                {donorData.isVerified && (
                  <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                    <CheckCircle2 className="h-3 w-3" />
                    Verified Donor
                  </span>
                )}
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
                  <span className="text-sm text-muted-foreground">Blood Type</span>
                  <span className="font-medium text-foreground">{donorData.bloodType}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
                  <span className="text-sm text-muted-foreground">Location</span>
                  <span className="text-right text-sm font-medium text-foreground">{donorData.location}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
                  <span className="text-sm text-muted-foreground">Last Donation</span>
                  <span className="font-medium text-foreground">{new Date(donorData.lastDonation).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
                  <span className="text-sm text-muted-foreground">Total Donations</span>
                  <span className="font-medium text-foreground">{statsData.totalDonations}</span>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-2">
                <Button asChild>
                  <Link href="/donor/profile">
                    <User className="mr-2 h-4 w-4" />
                    Update Profile
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/chat">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Open Messages
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
