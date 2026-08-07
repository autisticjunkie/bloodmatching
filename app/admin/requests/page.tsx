"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UrgencyBadge, RequestStatusBadge } from "@/components/shared/status-badges"
import { PageHeader } from "@/components/shared/page-header"
import { Search, Filter, MoreHorizontal, Eye, Droplet, Users } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { UrgencyLevel, RequestStatus } from "@/lib/types"

// Mock requests data
const allRequests = [
  {
    id: "REQ-001",
    requesterName: "Lagos University Teaching Hospital",
    bloodType: "O-",
    urgency: "critical" as UrgencyLevel,
    status: "active" as RequestStatus,
    matchedDonors: 3,
    hospital: "Lagos University Teaching Hospital",
    location: "Lagos, Lagos State",
    createdAt: "2024-03-15",
  },
  {
    id: "REQ-002",
    requesterName: "Amina Bello",
    bloodType: "A+",
    urgency: "high" as UrgencyLevel,
    status: "active" as RequestStatus,
    matchedDonors: 5,
    hospital: "National Hospital Abuja",
    location: "Abuja, FCT",
    createdAt: "2024-03-14",
  },
  {
    id: "REQ-003",
    requesterName: "University College Hospital",
    bloodType: "B+",
    urgency: "medium" as UrgencyLevel,
    status: "active" as RequestStatus,
    matchedDonors: 2,
    hospital: "University College Hospital",
    location: "Ibadan, Oyo",
    createdAt: "2024-03-13",
  },
  {
    id: "REQ-004",
    requesterName: "Oluwaseun Adeyemi",
    bloodType: "AB+",
    urgency: "low" as UrgencyLevel,
    status: "fulfilled" as RequestStatus,
    matchedDonors: 1,
    hospital: "Lagos General Hospital",
    location: "Ikeja, Lagos",
    createdAt: "2024-03-12",
  },
  {
    id: "REQ-005",
    requesterName: "Aminu Kano Teaching Hospital",
    bloodType: "O+",
    urgency: "high" as UrgencyLevel,
    status: "closed" as RequestStatus,
    matchedDonors: 0,
    hospital: "Aminu Kano Teaching Hospital",
    location: "Kano, Kano State",
    createdAt: "2024-03-10",
  },
]

export default function AdminRequestsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [urgencyFilter, setUrgencyFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredRequests = allRequests.filter((request) => {
    const matchesSearch =
      request.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.requesterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.hospital.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesUrgency = urgencyFilter === "all" || request.urgency === urgencyFilter
    const matchesStatus = statusFilter === "all" || request.status === statusFilter
    return matchesSearch && matchesUrgency && matchesStatus
  })

  return (
    <>
      <PageHeader
        title="Blood Requests"
        description="View and manage all blood donation requests"
      />

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by ID, requester, or hospital..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Urgency</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="fulfilled">Fulfilled</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requests Table */}
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Requests</CardTitle>
              <CardDescription>{filteredRequests.length} requests found</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request ID</TableHead>
                <TableHead>Requester</TableHead>
                <TableHead>Blood Type</TableHead>
                <TableHead>Hospital</TableHead>
                <TableHead>Urgency</TableHead>
                <TableHead>Matched</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[70px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-mono text-sm">{request.id}</TableCell>
                  <TableCell>
                    <p className="font-medium text-foreground">{request.requesterName}</p>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1 font-medium text-primary">
                      <Droplet className="h-3.5 w-3.5" />
                      {request.bloodType}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium">{request.hospital}</p>
                      <p className="text-xs text-muted-foreground">{request.location}</p>
                    </div>
                  </TableCell>
                  <TableCell><UrgencyBadge urgency={request.urgency} /></TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                      <Users className="h-3.5 w-3.5" />
                      {request.matchedDonors}
                    </span>
                  </TableCell>
                  <TableCell><RequestStatusBadge status={request.status} /></TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(request.createdAt).toLocaleDateString()}
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
                        <DropdownMenuItem>
                          <Users className="mr-2 h-4 w-4" />
                          View Matched Donors
                        </DropdownMenuItem>
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
