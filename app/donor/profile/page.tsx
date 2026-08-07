"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Loader2, CheckCircle2, Save } from "lucide-react"

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

export default function DonorProfilePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [user, setUser] = useState<{
    name: string
    email: string
    phone: string
    avatarUrl: string | null
    donorProfile: {
      bloodType: string
      state: string
      city: string
      gender: string | null
      isAvailable: boolean
      isVerified: boolean
      totalDonations: number
      lastDonationDate: string | null
    } | null
  } | null>(null)

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/auth/session")
        const data = await res.json()
        if (data.authenticated && data.user) {
          setUser(data.user)
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProfile()
  }, [])

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-muted-foreground">Unable to load profile. Please log in again.</p>
      </div>
    )
  }

  const profile = user.donorProfile
  const initials = user.name.split(" ").map((n) => n[0]).join("")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">My Profile</h1>
        <p className="text-muted-foreground">View and manage your donor profile information</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <Card className="md:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.avatarUrl || undefined} alt={user.name} />
                <AvatarFallback className="text-lg">{initials}</AvatarFallback>
              </Avatar>
              <h3 className="mt-4 text-lg font-semibold text-foreground">{user.name}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              {profile?.isVerified && (
                <Badge variant="secondary" className="mt-2 gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Verified Donor
                </Badge>
              )}
              {profile && (
                <div className="mt-4 grid w-full grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-foreground">{profile.totalDonations}</p>
                    <p className="text-xs text-muted-foreground">Donations</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">{profile.bloodType}</p>
                    <p className="text-xs text-muted-foreground">Blood Type</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Details Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
            <CardDescription>Your personal and donor information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input value={user.name} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={user.email} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input value={user.phone || "Not provided"} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Gender</Label>
                <Input value={profile?.gender || "Not specified"} readOnly className="capitalize" />
              </div>
            </div>

            {profile && (
              <>
                <div className="border-t border-border pt-4">
                  <h4 className="mb-4 text-sm font-medium text-foreground">Donor Information</h4>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Blood Type</Label>
                      <Input value={profile.bloodType} readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input value={`${profile.city}, ${profile.state}`} readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label>Last Donation</Label>
                      <Input value={profile.lastDonationDate ? new Date(profile.lastDonationDate).toLocaleDateString() : "No donations yet"} readOnly />
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-border p-3">
                      <div>
                        <Label>Available to Donate</Label>
                        <p className="text-xs text-muted-foreground">Toggle your availability</p>
                      </div>
                      <Switch checked={profile.isAvailable} disabled />
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
