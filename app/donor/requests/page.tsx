"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Clock, Droplet, AlertCircle, CheckCircle2, XCircle } from "lucide-react"

type UrgencyLevel = "low" | "medium" | "high" | "critical"
type RequestStatus = "pending" | "accepted" | "declined" | "completed"

const bloodRequests = [
  {
    id: 1,
    requesterName: "Lagos University Teaching Hospital",
    bloodType: "O+",
    urgency: "critical" as UrgencyLevel,
    location: "Lagos",
    hospital: "Lagos University Teaching Hospital",
    unitsNeeded: 3,
    postedAt: "2 hours ago",
    neededBy: "Tomorrow",
    status: "pending" as RequestStatus,
    notes: "Emergency surgery - urgent need",
  },
  {
    id: 2,
    requesterName: "Amina Bello",
    bloodType: "O+",
    urgency: "high" as UrgencyLevel,
    location: "Ikeja",
    hospital: "National Hospital Abuja",
    unitsNeeded: 2,
    postedAt: "5 hours ago",
    neededBy: "3 days",
    status: "accepted" as RequestStatus,
    notes: "For scheduled surgery",
  },
  {
    id: 3,
    requesterName: "National Hospital Abuja",
    bloodType: "O+",
    urgency: "medium" as UrgencyLevel,
    location: "Abuja",
    hospital: "National Hospital Abuja",
    unitsNeeded: 1,
    postedAt: "1 day ago",
    neededBy: "1 week",
    status: "completed" as RequestStatus,
    notes: "Regular transfusion for patient",
  },
  {
    id: 4,
    requesterName: "Dr. Adebayo",
    bloodType: "O+",
    urgency: "low" as UrgencyLevel,
    location: "Ibadan",
    hospital: "University College Hospital Ibadan",
    unitsNeeded: 1,
    postedAt: "2 days ago",
    neededBy: "2 weeks",
    status: "declined" as RequestStatus,
    notes: "Routine blood bank replenishment",
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
    case "pending":
      return <Badge variant="outline" className="gap-1"><Clock className="h-3 w-3" />Pending</Badge>
    case "accepted":
      return <Badge className="gap-1 bg-green-600 text-white hover:bg-green-600"><CheckCircle2 className="h-3 w-3" />Accepted</Badge>
    case "declined":
      return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" />Declined</Badge>
    case "completed":
      return <Badge className="gap-1 bg-blue-600 text-white hover:bg-blue-600"><CheckCircle2 className="h-3 w-3" />Completed</Badge>
  }
}

export default function DonorRequestsPage() {
  const [activeTab, setActiveTab] = useState("all")

  const filteredRequests = activeTab === "all"
    ? bloodRequests
    : bloodRequests.filter(r => r.status === activeTab)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Blood Requests</h1>
        <p className="text-muted-foreground">View and respond to blood donation requests matching your blood type</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All ({bloodRequests.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({bloodRequests.filter(r => r.status === "pending").length})</TabsTrigger>
          <TabsTrigger value="accepted">Accepted ({bloodRequests.filter(r => r.status === "accepted").length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({bloodRequests.filter(r => r.status === "completed").length})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="space-y-4">
            {filteredRequests.length > 0 ? (
              filteredRequests.map((request) => (
                <Card key={request.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback>{request.requesterName.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-foreground">{request.requesterName}</h3>
                            {getUrgencyBadge(request.urgency)}
                          </div>
                          <p className="text-sm text-muted-foreground">{request.hospital}</p>
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
                          </div>
                          {request.notes && (
                            <p className="mt-1 text-sm text-muted-foreground">
                              <AlertCircle className="mr-1 inline h-3.5 w-3.5" />
                              {request.notes}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(request.status)}
                        <span className="text-xs text-muted-foreground">{request.postedAt}</span>
                      </div>
                    </div>
                    {request.status === "pending" && (
                      <div className="mt-4 flex gap-2 border-t border-border pt-4">
                        <Button size="sm">Accept Request</Button>
                        <Button size="sm" variant="outline">Decline</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="flex min-h-[200px] items-center justify-center p-6">
                  <p className="text-muted-foreground">No requests found for this filter.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
