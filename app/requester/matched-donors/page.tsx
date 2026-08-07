"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Droplet,
  MapPin,
  Clock,
  MessageSquare,
  Star,
  CheckCircle2,
  Shield,
  AlertCircle,
  Building2,
  Calendar,
  Users,
} from "lucide-react"

// Mock data for current request
const requests = [
  {
    id: "REQ-001",
    bloodType: "O+",
    urgency: "critical",
    hospital: "Lagos General Hospital",
    location: "Lagos, Lagos State",
    unitsNeeded: 3,
    postedAt: "2 hours ago",
    neededBy: "Today",
  },
  {
    id: "REQ-002",
    bloodType: "A-",
    urgency: "high",
    hospital: "Lagos General Hospital",
    location: "Lagos, Lagos State",
    unitsNeeded: 2,
    postedAt: "1 day ago",
    neededBy: "Tomorrow",
  },
  {
    id: "REQ-003",
    bloodType: "B+",
    urgency: "medium",
    hospital: "Lagos General Hospital",
    location: "Lagos, Lagos State",
    unitsNeeded: 1,
    postedAt: "3 days ago",
    neededBy: "Apr 15, 2026",
  },
]

// Mock matched donors data
const matchedDonors = [
  {
    id: 1,
    name: "Chinedu Okafor",
    bloodType: "O+",
    city: "Lagos",
    state: "Lagos State",
    isAvailable: true,
    isVerified: true,
    lastActive: "5 minutes ago",
    isShortlisted: false,
    avatar: "/images/donor-portrait-1.jpg",
    requestId: "REQ-001",
    totalDonations: 8,
  },
  {
    id: 2,
    name: "Emeka Nwosu",
    bloodType: "O+",
    city: "Ikeja",
    state: "Lagos State",
    isAvailable: true,
    isVerified: true,
    lastActive: "1 hour ago",
    isShortlisted: true,
    avatar: "/images/donor-portrait-2.jpg",
    requestId: "REQ-001",
    totalDonations: 12,
  },
  {
    id: 3,
    name: "Funke Oladipo",
    bloodType: "O+",
    city: "Abuja",
    state: "FCT",
    isAvailable: false,
    isVerified: true,
    lastActive: "3 hours ago",
    isShortlisted: false,
    avatar: undefined as string | undefined,
    requestId: "REQ-001",
    totalDonations: 5,
  },
  {
    id: 4,
    name: "Tunde Adeyemi",
    bloodType: "A-",
    city: "Lagos",
    state: "Lagos State",
    isAvailable: true,
    isVerified: false,
    lastActive: "30 minutes ago",
    isShortlisted: false,
    avatar: undefined as string | undefined,
    requestId: "REQ-002",
    totalDonations: 2,
  },
  {
    id: 5,
    name: "Ngozi Eze",
    bloodType: "A-",
    city: "Surulere",
    state: "Lagos State",
    isAvailable: true,
    isVerified: true,
    lastActive: "2 hours ago",
    isShortlisted: true,
    avatar: undefined as string | undefined,
    requestId: "REQ-002",
    totalDonations: 15,
  },
  {
    id: 6,
    name: "Yusuf Ibrahim",
    bloodType: "B+",
    city: "Lekki",
    state: "Lagos State",
    isAvailable: true,
    isVerified: true,
    lastActive: "1 day ago",
    isShortlisted: false,
    avatar: undefined as string | undefined,
    requestId: "REQ-003",
    totalDonations: 7,
  },
]

function getUrgencyBadge(urgency: string) {
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

export default function MatchedDonorsPage() {
  const [selectedRequest, setSelectedRequest] = useState<string>("REQ-001")
  const [shortlistedDonors, setShortlistedDonors] = useState<number[]>(
    matchedDonors.filter(d => d.isShortlisted).map(d => d.id)
  )

  const currentRequest = requests.find(r => r.id === selectedRequest)
  const filteredDonors = matchedDonors.filter(d => d.requestId === selectedRequest)

  const toggleShortlist = (donorId: number) => {
    setShortlistedDonors(prev =>
      prev.includes(donorId)
        ? prev.filter(id => id !== donorId)
        : [...prev, donorId]
    )
  }

  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Matched Donors</h1>
        <p className="mt-1 text-muted-foreground">
          View and connect with donors who match your blood requests
        </p>
      </div>

          {/* Request Filter */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-foreground">
              Select Blood Request
            </label>
            <Select value={selectedRequest} onValueChange={setSelectedRequest}>
              <SelectTrigger className="w-full sm:w-80">
                <SelectValue placeholder="Select a request" />
              </SelectTrigger>
              <SelectContent>
                {requests.map((request) => (
                  <SelectItem key={request.id} value={request.id}>
                    <span className="flex items-center gap-2">
                      <span className="font-medium">{request.bloodType}</span>
                      <span className="text-muted-foreground">-</span>
                      <span>{request.id}</span>
                      <span className="text-muted-foreground">({request.urgency})</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Request Summary Card */}
          {currentRequest && (
            <Card className="mb-6 border-l-4 border-l-primary">
              <CardContent className="pt-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                      <Droplet className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-xl font-bold text-foreground">
                          {currentRequest.bloodType} Blood Needed
                        </h2>
                        {getUrgencyBadge(currentRequest.urgency)}
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Building2 className="h-4 w-4" />
                          {currentRequest.hospital}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-4 w-4" />
                          {currentRequest.location}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Droplet className="h-4 w-4" />
                          {currentRequest.unitsNeeded} unit{currentRequest.unitsNeeded !== 1 ? "s" : ""} needed
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4" />
                          Needed by {currentRequest.neededBy}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          Posted {currentRequest.postedAt}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">{filteredDonors.length}</span>
                    <span className="text-muted-foreground">donor{filteredDonors.length !== 1 ? "s" : ""} matched</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Donors Grid */}
          {filteredDonors.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredDonors.map((donor) => (
                <Card key={donor.id} className="relative overflow-hidden">
                  {/* Shortlist indicator */}
                  {shortlistedDonors.includes(donor.id) && (
                    <div className="absolute right-0 top-0 rounded-bl-lg bg-amber-100 px-2 py-1">
                      <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                    </div>
                  )}
                  
                  <CardContent className="pt-6">
                    {/* Donor Header */}
                    <div className="flex items-start gap-4">
                      <Avatar className="h-14 w-14">
                        <AvatarImage src={donor.avatar} alt={donor.name} />
                        <AvatarFallback className="text-lg">
                          {donor.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground">{donor.name}</h3>
                          {donor.isVerified && (
                            <Shield className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                            {donor.bloodType}
                          </span>
                          {donor.isVerified ? (
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                              <CheckCircle2 className="mr-1 h-3 w-3" />
                              Verified
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-muted-foreground">
                              Unverified
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Donor Details */}
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2 text-sm">
                        <span className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          Location
                        </span>
                        <span className="font-medium text-foreground">
                          {donor.city}, {donor.state}
                        </span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2 text-sm">
                        <span className="flex items-center gap-2 text-muted-foreground">
                          <Droplet className="h-4 w-4" />
                          Total Donations
                        </span>
                        <span className="font-medium text-foreground">
                          {donor.totalDonations}
                        </span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2 text-sm">
                        <span className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          Last Active
                        </span>
                        <span className="font-medium text-foreground">
                          {donor.lastActive}
                        </span>
                      </div>
                    </div>

                    {/* Availability Status */}
                    <div className="mt-4">
                      {donor.isAvailable ? (
                        <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
                          </span>
                          Available for Donation
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
                          <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/50" />
                          Currently Unavailable
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 flex gap-2">
                      <Button 
                        className="flex-1"
                        disabled={!donor.isAvailable}
                        asChild
                      >
                        <Link href={`/requester/messages?donor=${donor.id}`}>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Start Chat
                        </Link>
                      </Button>
                      <Button
                        variant={shortlistedDonors.includes(donor.id) ? "secondary" : "outline"}
                        size="icon"
                        onClick={() => toggleShortlist(donor.id)}
                        title={shortlistedDonors.includes(donor.id) ? "Remove from shortlist" : "Add to shortlist"}
                      >
                        <Star 
                          className={`h-4 w-4 ${
                            shortlistedDonors.includes(donor.id) 
                              ? "fill-amber-500 text-amber-500" 
                              : ""
                          }`} 
                        />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <AlertCircle className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-foreground">No Matched Donors</h3>
                <p className="mt-2 max-w-sm text-center text-muted-foreground">
                  There are no donors matched to this request yet. We&apos;re actively searching for compatible donors in the area.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Shortlisted Donors Summary */}
          {shortlistedDonors.length > 0 && (
            <Card className="mt-6">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
                    Shortlisted Donors
                  </CardTitle>
                  <Badge variant="secondary">
                    {shortlistedDonors.length} donor{shortlistedDonors.length !== 1 ? "s" : ""}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex flex-wrap gap-2">
                  {matchedDonors
                    .filter(d => shortlistedDonors.includes(d.id))
                    .map((donor) => (
                      <div
                        key={donor.id}
                        className="flex items-center gap-2 rounded-full bg-muted px-3 py-1.5"
                      >
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={donor.avatar} alt={donor.name} />
                          <AvatarFallback className="text-xs">
                            {donor.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{donor.name}</span>
                        <Badge variant="outline" className="h-5 px-1.5 text-xs">
                          {donor.bloodType}
                        </Badge>
                        <button
                          onClick={() => toggleShortlist(donor.id)}
                          className="ml-1 text-muted-foreground hover:text-foreground"
                        >
                          <span className="sr-only">Remove from shortlist</span>
                          &times;
                        </button>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
    </>
  )
}
