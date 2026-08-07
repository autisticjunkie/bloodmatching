"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { StatCardSmall } from "@/components/shared/stat-card"
import { UrgencyBadge, RequestStatusBadge, RoleBadge, VerificationBadge } from "@/components/shared/status-badges"
import { PageHeader } from "@/components/shared/page-header"
import {
  Users,
  Droplet,
  Heart,
  FileHeart,
  MessageSquare,
  CheckCircle2,
  TrendingUp,
  UserCheck,
  Activity,
  XCircle,
} from "lucide-react"
import type { UrgencyLevel, RequestStatus, UserRole, VerificationStatus } from "@/lib/types"

// Mock statistics data
const statsData = {
  totalUsers: 1248,
  totalDonors: 892,
  totalRequesters: 356,
  activeRequests: 47,
  totalMatches: 234,
  activeConversations: 89,
}

// Mock recent users data
const recentUsers = [
  {
    id: 1,
    name: "Chinedu Okafor",
    email: "chinedu.okafor@email.com",
    role: "donor" as UserRole,
    bloodType: "O+",
    status: "verified" as VerificationStatus,
    joinedAt: "2024-03-15",
    avatar: "/images/donor-portrait-1.jpg",
  },
  {
    id: 2,
    name: "Amina Bello",
    email: "amina.bello@email.com",
    role: "requester" as UserRole,
    bloodType: null,
    status: "verified" as VerificationStatus,
    joinedAt: "2024-03-14",
    avatar: null,
  },
  {
    id: 3,
    name: "Emeka Nwosu",
    email: "emeka.nwosu@email.com",
    role: "donor" as UserRole,
    bloodType: "A+",
    status: "pending" as VerificationStatus,
    joinedAt: "2024-03-14",
    avatar: "/images/donor-portrait-2.jpg",
  },
  {
    id: 4,
    name: "Lagos General Hospital",
    email: "contact@lagosgeneral.com",
    role: "requester" as UserRole,
    bloodType: null,
    status: "verified" as VerificationStatus,
    joinedAt: "2024-03-13",
    avatar: null,
  },
  {
    id: 5,
    name: "Tunde Adeyemi",
    email: "tunde.adeyemi@email.com",
    role: "donor" as UserRole,
    bloodType: "B+",
    status: "pending" as VerificationStatus,
    joinedAt: "2024-03-13",
    avatar: null,
  },
]

// Mock recent blood requests
const recentRequests = [
  {
    id: "REQ-001",
    requesterName: "Hospital Lagos",
    bloodType: "O-",
    urgency: "critical" as UrgencyLevel,
    status: "active" as RequestStatus,
    matchedDonors: 3,
    createdAt: "2 hours ago",
  },
  {
    id: "REQ-002",
    requesterName: "Amina Bello",
    bloodType: "A+",
    urgency: "high" as UrgencyLevel,
    status: "active" as RequestStatus,
    matchedDonors: 5,
    createdAt: "5 hours ago",
  },
  {
    id: "REQ-003",
    requesterName: "National Hospital Abuja",
    bloodType: "B+",
    urgency: "medium" as UrgencyLevel,
    status: "active" as RequestStatus,
    matchedDonors: 2,
    createdAt: "1 day ago",
  },
  {
    id: "REQ-004",
    requesterName: "Oluwaseun Adeyemi",
    bloodType: "AB+",
    urgency: "low" as UrgencyLevel,
    status: "fulfilled" as RequestStatus,
    matchedDonors: 1,
    createdAt: "2 days ago",
  },
]

// Mock pending verifications
const pendingVerifications = [
  {
    id: 1,
    name: "Emeka Nwosu",
    email: "emeka.nwosu@email.com",
    bloodType: "A+",
    location: "Ikeja, Lagos",
    submittedAt: "2024-03-14",
    avatar: "/images/donor-portrait-2.jpg",
  },
  {
    id: 2,
    name: "Tunde Adeyemi",
    email: "tunde.adeyemi@email.com",
    bloodType: "B+",
    location: "Lekki, Lagos",
    submittedAt: "2024-03-13",
    avatar: null,
  },
  {
    id: 3,
    name: "Ngozi Eze",
    email: "ngozi.eze@email.com",
    bloodType: "O+",
    location: "Lagos",
    submittedAt: "2024-03-12",
    avatar: null,
  },
]

// Mock system activity
const systemActivity = [
  { id: 1, type: "match", message: "New donor matched with request REQ-001", time: "5 minutes ago" },
  { id: 2, type: "registration", message: "New donor registered: Chinedu Okafor", time: "15 minutes ago" },
  { id: 3, type: "request", message: "New blood request created: O- needed urgently", time: "30 minutes ago" },
  { id: 4, type: "verification", message: "Donor verified: Funke Oladipo", time: "1 hour ago" },
  { id: 5, type: "fulfilled", message: "Request REQ-004 marked as fulfilled", time: "2 hours ago" },
]

function getActivityIcon(type: string) {
  switch (type) {
    case "match":
      return <Heart className="h-4 w-4 text-primary" />
    case "registration":
      return <Users className="h-4 w-4 text-blue-600" />
    case "request":
      return <FileHeart className="h-4 w-4 text-amber-600" />
    case "verification":
      return <CheckCircle2 className="h-4 w-4 text-green-600" />
    case "fulfilled":
      return <CheckCircle2 className="h-4 w-4 text-primary" />
    default:
      return <Activity className="h-4 w-4 text-muted-foreground" />
  }
}

export default function AdminDashboardPage() {
  const [verificationLoading, setVerificationLoading] = useState<number | null>(null)

  const handleVerify = (userId: number) => {
    setVerificationLoading(userId)
    setTimeout(() => setVerificationLoading(null), 1000)
  }

  return (
    <>
      <PageHeader
        title="Admin Dashboard"
        description="Overview of your blood donation platform"
      />

      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCardSmall title="Total Users" value={statsData.totalUsers} icon={Users} iconClassName="text-blue-600" iconBgClassName="bg-blue-100" />
        <StatCardSmall title="Total Donors" value={statsData.totalDonors} icon={Droplet} />
        <StatCardSmall title="Requesters" value={statsData.totalRequesters} icon={Heart} iconClassName="text-green-600" iconBgClassName="bg-green-100" />
        <StatCardSmall title="Active Requests" value={statsData.activeRequests} icon={FileHeart} iconClassName="text-amber-600" iconBgClassName="bg-amber-100" />
        <StatCardSmall title="Total Matches" value={statsData.totalMatches} icon={TrendingUp} />
        <StatCardSmall title="Conversations" value={statsData.activeConversations} icon={MessageSquare} iconClassName="text-blue-600" iconBgClassName="bg-blue-100" />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Tables */}
        <div className="space-y-6 lg:col-span-2">
          {/* Recent Users Table */}
          <Card>
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Users</CardTitle>
                  <CardDescription>Latest registered users on the platform</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/admin/users">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Blood Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
                            <AvatarFallback className="text-xs">
                              {user.name.split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell><RoleBadge role={user.role} /></TableCell>
                      <TableCell>
                        {user.bloodType ? (
                          <span className="font-medium text-primary">{user.bloodType}</span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell><VerificationBadge status={user.status} /></TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(user.joinedAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Recent Blood Requests Table */}
          <Card>
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Blood Requests</CardTitle>
                  <CardDescription>Latest blood donation requests</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/admin/requests">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Requester</TableHead>
                    <TableHead>Blood Type</TableHead>
                    <TableHead>Urgency</TableHead>
                    <TableHead>Matched</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-mono text-sm">{request.id}</TableCell>
                      <TableCell>
                        <p className="font-medium text-foreground">{request.requesterName}</p>
                        <p className="text-xs text-muted-foreground">{request.createdAt}</p>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1 font-medium text-primary">
                          <Droplet className="h-3.5 w-3.5" />
                          {request.bloodType}
                        </span>
                      </TableCell>
                      <TableCell><UrgencyBadge urgency={request.urgency} /></TableCell>
                      <TableCell>
                        <span className="text-muted-foreground">{request.matchedDonors} donors</span>
                      </TableCell>
                      <TableCell><RequestStatusBadge status={request.status} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Verification & Activity */}
        <div className="space-y-6">
          {/* Donor Verification Panel */}
          <Card>
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5 text-primary" />
                    Pending Verifications
                  </CardTitle>
                  <CardDescription>Donors awaiting verification</CardDescription>
                </div>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-medium">
                  {pendingVerifications.length}
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {pendingVerifications.map((donor) => (
                  <div key={donor.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        {donor.avatar && <AvatarImage src={donor.avatar} alt={donor.name} />}
                        <AvatarFallback>
                          {donor.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-foreground">{donor.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{donor.email}</p>
                        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="font-medium text-primary">{donor.bloodType}</span>
                          <span>-</span>
                          <span>{donor.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => handleVerify(donor.id)}
                        disabled={verificationLoading === donor.id}
                      >
                        {verificationLoading === donor.id ? (
                          <span className="flex items-center gap-2">
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            Verifying...
                          </span>
                        ) : (
                          <>
                            <CheckCircle2 className="mr-1 h-4 w-4" />
                            Verify
                          </>
                        )}
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <XCircle className="mr-1 h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Activity */}
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-muted-foreground" />
                System Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {systemActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-foreground">{activity.message}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
