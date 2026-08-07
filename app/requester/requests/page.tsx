"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Droplet, MapPin, Clock, Users, AlertCircle } from "lucide-react"

type UrgencyLevel = "low" | "medium" | "high" | "critical"
type RequestStatus = "active" | "fulfilled" | "cancelled" | "expired"

const myRequests = [
  {
    id: "REQ-001",
    patientName: "Patient A",
    bloodType: "O+",
    unitsNeeded: 2,
    urgency: "critical" as UrgencyLevel,
    hospital: "Lagos University Teaching Hospital",
    location: "Lagos, Lagos State",
    status: "active" as RequestStatus,
    matchedDonors: 2,
    createdAt: "2 hours ago",
    neededBy: "Tomorrow",
  },
  {
    id: "REQ-002",
    patientName: "Patient B",
    bloodType: "A-",
    unitsNeeded: 1,
    urgency: "high" as UrgencyLevel,
    hospital: "Lagos University Teaching Hospital",
    location: "Lagos, Lagos State",
    status: "active" as RequestStatus,
    matchedDonors: 3,
    createdAt: "1 day ago",
    neededBy: "3 days",
  },
  {
    id: "REQ-003",
    patientName: "Patient C",
    bloodType: "B+",
    unitsNeeded: 3,
    urgency: "medium" as UrgencyLevel,
    hospital: "National Hospital Abuja",
    location: "Abuja, FCT",
    status: "fulfilled" as RequestStatus,
    matchedDonors: 3,
    createdAt: "1 week ago",
    neededBy: "Completed",
  },
  {
    id: "REQ-004",
    patientName: "Patient D",
    bloodType: "AB+",
    unitsNeeded: 1,
    urgency: "low" as UrgencyLevel,
    hospital: "University College Hospital",
    location: "Ibadan, Oyo",
    status: "cancelled" as RequestStatus,
    matchedDonors: 0,
    createdAt: "2 weeks ago",
    neededBy: "N/A",
  },
]

function getUrgencyBadge(urgency: UrgencyLevel) {
  switch (urgency) {
    case "critical":
      return <Badge className="bg-red-600 text-white hover:bg-red-600">Critical</Badge>
    case "high":
      return <Badge className="bg-orange-500 text-white hover:bg-orange-500">High</Badge>
    case "medium":
      return <Badge className="bg-yellow-500 text-white hover:bg-yellow-500">Medium</Badge>
    case "low":
      return <Badge variant="secondary">Low</Badge>
  }
}

function getStatusBadge(status: RequestStatus) {
  switch (status) {
    case "active":
      return <Badge className="bg-green-600 text-white hover:bg-green-600">Active</Badge>
    case "fulfilled":
      return <Badge className="bg-blue-600 text-white hover:bg-blue-600">Fulfilled</Badge>
    case "cancelled":
      return <Badge variant="destructive">Cancelled</Badge>
    case "expired":
      return <Badge variant="secondary">Expired</Badge>
  }
}

export default function RequesterRequestsPage() {
  const [activeTab, setActiveTab] = useState("all")

  const filteredRequests = activeTab === "all"
    ? myRequests
    : myRequests.filter(r => r.status === activeTab)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">My Requests</h1>
          <p className="text-muted-foreground">Manage and track your blood donation requests</p>
        </div>
        <Button asChild>
          <Link href="/requester/create-request">
            <Plus className="mr-2 h-4 w-4" />
            New Request
          </Link>
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All ({myRequests.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({myRequests.filter(r => r.status === "active").length})</TabsTrigger>
          <TabsTrigger value="fulfilled">Fulfilled ({myRequests.filter(r => r.status === "fulfilled").length})</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled ({myRequests.filter(r => r.status === "cancelled").length})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="space-y-4">
            {filteredRequests.length > 0 ? (
              filteredRequests.map((request) => (
                <Card key={request.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground">{request.id}</h3>
                          {getUrgencyBadge(request.urgency)}
                          {getStatusBadge(request.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">Patient: {request.patientName}</p>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Droplet className="h-3.5 w-3.5 text-primary" />
                            {request.bloodType} · {request.unitsNeeded} unit{request.unitsNeeded > 1 ? "s" : ""}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {request.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            Needed by: {request.neededBy}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5" />
                            {request.matchedDonors} donor{request.matchedDonors !== 1 ? "s" : ""} matched
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {request.hospital} · Created {request.createdAt}
                        </p>
                      </div>
                      {request.status === "active" && (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" asChild>
                            <Link href="/requester/matched-donors">View Donors</Link>
                          </Button>
                          <Button size="sm" variant="destructive">Cancel</Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="flex min-h-[200px] flex-col items-center justify-center gap-2 p-6">
                  <AlertCircle className="h-8 w-8 text-muted-foreground" />
                  <p className="text-muted-foreground">No requests found for this filter.</p>
                  <Button asChild size="sm" className="mt-2">
                    <Link href="/requester/create-request">Create a Request</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
