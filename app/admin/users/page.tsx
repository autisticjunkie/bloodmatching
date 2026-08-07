"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RoleBadge, VerificationBadge } from "@/components/shared/status-badges"
import { PageHeader } from "@/components/shared/page-header"
import { Search, Filter, MoreHorizontal, CheckCircle2, XCircle, Eye } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { UserRole, VerificationStatus } from "@/lib/types"

// Mock users data
const allUsers = [
  {
    id: 1,
    name: "Chinedu Okafor",
    email: "chinedu.okafor@email.com",
    role: "donor" as UserRole,
    bloodType: "O+",
    location: "Victoria Island, Lagos",
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
    location: "Ikeja, Lagos",
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
    location: "Ikeja, Lagos",
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
    location: "Victoria Island, Lagos",
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
    location: "Lekki, Lagos",
    status: "pending" as VerificationStatus,
    joinedAt: "2024-03-13",
    avatar: null,
  },
  {
    id: 6,
    name: "Ngozi Eze",
    email: "ngozi.eze@email.com",
    role: "donor" as UserRole,
    bloodType: "O+",
    location: "Abuja, FCT",
    status: "rejected" as VerificationStatus,
    joinedAt: "2024-03-12",
    avatar: null,
  },
]

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredUsers = allUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  return (
    <>
      <PageHeader
        title="Users Management"
        description="View and manage all registered users on the platform"
      />

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="donor">Donors</SelectItem>
                  <SelectItem value="requester">Requesters</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Users</CardTitle>
              <CardDescription>{filteredUsers.length} users found</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Blood Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="w-[70px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
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
                  <TableCell className="text-sm text-muted-foreground">{user.location}</TableCell>
                  <TableCell><VerificationBadge status={user.status} /></TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(user.joinedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        {user.status === "pending" && (
                          <>
                            <DropdownMenuItem className="text-green-600">
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Verify User
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <XCircle className="mr-2 h-4 w-4" />
                              Reject User
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}
