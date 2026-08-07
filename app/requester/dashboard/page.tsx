"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { StatCard } from "@/components/shared/stat-card"
import { UrgencyBadge, RequestStatusBadge, MatchStatusBadge } from "@/components/shared/status-badges"
import { EmptyState } from "@/components/shared/empty-state"
import { PageHeader } from "@/components/shared/page-header"
import {
  Droplet,
  FileHeart,
  Users,
  MessageSquare,
  CheckCircle2,
  MapPin,
  Clock,
  AlertCircle,
  Plus,
  ChevronRight,
  Building2,
} from "lucide-react"
import type { UrgencyLevel, RequestStatus, MatchStatus } from "@/lib/types"

// Mock data for demonstration
const requesterData = {
  name: "Aisha Musa",
  email: "aisha.musa@hospital.com",
  type: "Hospital",
  organization: "Lagos General Hospital",
  location: "Lagos, Lagos State",
}

const statsData = {
  activeRequests: 3,
  matchedDonors: 8,
  unreadMessages: 5,
  completedRequests: 12,
}

const activeRequests = [
  {
    id: 1,
    bloodType: "O+",
    urgency: "critical" as UrgencyLevel,
    hospital: "Lagos General Hospital",
    location: "Lagos",
    postedAt: "2 hours ago",
    status: "active" as RequestStatus,
    matchedDonors: 3,
  },
  {
    id: 2,
    bloodType: "A-",
    urgency: "high" as UrgencyLevel,
    hospital: "Lagos General Hospital",
    location: "Lagos",
    postedAt: "1 day ago",
    status: "active" as RequestStatus,
    matchedDonors: 2,
  },
  {
    id: 3,
    bloodType: "B+",
    urgency: "medium" as UrgencyLevel,
    hospital: "Lagos General Hospital",
    location: "Lagos",
    postedAt: "3 days ago",
    status: "active" as RequestStatus,
    matchedDonors: 5,
  },
]

const recentMatchedDonors = [
  {
    id: 1,
    name: "Chinedu Okafor",
    bloodType: "O+",
    location: "Lagos",
    status: "confirmed" as MatchStatus,
    avatar: "/images/donor-portrait-1.jpg",
  },
  {
    id: 2,
    name: "Emeka Nwosu",
    bloodType: "A-",
    location: "Ikeja",
    status: "pending" as MatchStatus,
    avatar: "/images/donor-portrait-2.jpg",
  },
  {
    id: 3,
    name: "Funke Oladipo",
    bloodType: "B+",
    location: "Abuja",
    status: "confirmed" as MatchStatus,
    avatar: undefined as string | undefined,
  },
]

export default function RequesterDashboardPage() {
  return (
    <>
      <PageHeader
        title={`Welcome back, ${requesterData.name.split(" ")[0]}`}
        description="Manage your blood requests and connect with donors"
        actionLabel="Create Blood Request"
        actionHref="/requester/create-request"
        actionIcon={Plus}
      />

      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Requests"
          value={statsData.activeRequests}
          icon={FileHeart}
        />
        <StatCard
          title="Matched Donors"
          value={statsData.matchedDonors}
          icon={Users}
          iconClassName="text-green-600"
          iconBgClassName="bg-green-100"
        />
        <StatCard
          title="Unread Messages"
          value={statsData.unreadMessages}
          icon={MessageSquare}
          href="/chat"
          badge={statsData.unreadMessages}
        />
        <StatCard
          title="Completed"
          value={statsData.completedRequests}
          icon={CheckCircle2}
          iconClassName="text-muted-foreground"
          iconBgClassName="bg-muted"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Active Blood Requests */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Active Blood Requests</CardTitle>
                  <CardDescription>Your current blood requests awaiting donors</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/requester/requests">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {activeRequests.length > 0 ? (
                <div className="divide-y divide-border">
                  {activeRequests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-4 transition-colors hover:bg-muted/50">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                          <Droplet className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-foreground">{request.bloodType}</p>
                            <UrgencyBadge urgency={request.urgency} />
                          </div>
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
                          <RequestStatusBadge status={request.status} />
                          <span className="text-sm text-muted-foreground">
                            {request.matchedDonors} donor{request.matchedDonors !== 1 ? "s" : ""} matched
                          </span>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={AlertCircle}
                  title="No active requests"
                  actionLabel="Create Your First Request"
                  actionHref="/requester/create-request"
                  actionIcon={Plus}
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Account Info */}
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="text-base">Account Info</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
                  <span className="text-sm text-muted-foreground">Type</span>
                  <span className="flex items-center gap-1.5 font-medium text-foreground">
                    <Building2 className="h-4 w-4" />
                    {requesterData.type}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
                  <span className="text-sm text-muted-foreground">Organization</span>
                  <span className="max-w-[150px] truncate text-right text-sm font-medium text-foreground">
                    {requesterData.organization}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
                  <span className="text-sm text-muted-foreground">Location</span>
                  <span className="text-right text-sm font-medium text-foreground">
                    {requesterData.location.split(",")[0]}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Matched Donors */}
          <Card>
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Recent Matched Donors</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/requester/matched-donors">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {recentMatchedDonors.length > 0 ? (
                <div className="divide-y divide-border">
                  {recentMatchedDonors.map((donor) => (
                    <div key={donor.id} className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={donor.avatar} alt={donor.name} />
                          <AvatarFallback className="text-sm">
                            {donor.name.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-foreground">{donor.name}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Droplet className="h-3 w-3" />
                              {donor.bloodType}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {donor.location}
                            </span>
                          </div>
                        </div>
                      </div>
                      <MatchStatusBadge status={donor.status} />
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Users}
                  title="No matched donors yet"
                  className="py-8"
                />
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-2">
                <Button asChild>
                  <Link href="/requester/create-request">
                    <Plus className="mr-2 h-4 w-4" />
                    New Blood Request
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/chat">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Open Messages
                    {statsData.unreadMessages > 0 && (
                      <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                        {statsData.unreadMessages}
                      </span>
                    )}
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
