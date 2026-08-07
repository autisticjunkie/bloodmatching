"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertCircle,
  ArrowLeft,
  Droplet,
  Building2,
  MapPin,
  Phone,
  Calendar,
  FileText,
  AlertTriangle,
  Loader2,
} from "lucide-react"

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

const urgencyLevels = [
  { value: "critical", label: "Critical - Needed immediately", description: "Life-threatening emergency" },
  { value: "high", label: "Urgent - Within 24 hours", description: "Time-sensitive requirement" },
  { value: "medium", label: "Medium - Within 3 days", description: "Scheduled procedure" },
  { value: "low", label: "Normal - Within a week", description: "Non-urgent requirement" },
]

const states = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT Abuja", "Gombe",
  "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara",
  "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau",
  "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
]

export default function CreateBloodRequestPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    patientName: "",
    bloodType: "",
    unitsNeeded: "",
    urgency: "",
    hospitalName: "",
    state: "",
    city: "",
    contactPhone: "",
    neededDate: "",
    additionalNotes: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    // Redirect to dashboard after submission
    router.push("/requester/dashboard")
  }

  const isFormValid = 
    formData.patientName &&
    formData.bloodType &&
    formData.unitsNeeded &&
    formData.urgency &&
    formData.hospitalName &&
    formData.state &&
    formData.city &&
    formData.contactPhone &&
    formData.neededDate

  return (
    <>
      {/* Header */}
          <div className="mb-6">
            <Button variant="ghost" size="sm" asChild className="mb-4">
              <Link href="/requester/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
            <h1 className="text-2xl font-semibold text-foreground">
              Create Blood Request
            </h1>
            <p className="mt-1 text-muted-foreground">
              Submit a new blood request to find matching donors in your area
            </p>
          </div>

          {/* Urgency Notice */}
          <Card className="mb-6 border-amber-200 bg-amber-50">
            <CardContent className="flex items-start gap-3 pt-6">
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-amber-900">For Medical Emergencies</p>
                <p className="text-sm text-amber-800 mt-1">
                  If this is a life-threatening emergency, please also contact your local blood bank or emergency services directly. This platform connects you with voluntary donors but should not replace professional medical channels.
                </p>
              </div>
            </CardContent>
          </Card>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Main Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Patient Information */}
                <Card>
                  <CardHeader className="border-b">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Patient Information</CardTitle>
                        <CardDescription>Basic details about the patient</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="patientName">
                        Patient Name or Identifier <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="patientName"
                        placeholder="Enter patient name or ID (e.g., Patient #1234)"
                        value={formData.patientName}
                        onChange={(e) => handleInputChange("patientName", e.target.value)}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        You can use a patient ID for privacy if preferred
                      </p>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="bloodType">
                          Blood Type Needed <span className="text-destructive">*</span>
                        </Label>
                        <Select
                          value={formData.bloodType}
                          onValueChange={(value) => handleInputChange("bloodType", value)}
                        >
                          <SelectTrigger id="bloodType">
                            <SelectValue placeholder="Select blood type" />
                          </SelectTrigger>
                          <SelectContent>
                            {bloodTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                <span className="flex items-center gap-2">
                                  <Droplet className="h-4 w-4 text-primary" />
                                  {type}
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="unitsNeeded">
                          Number of Units <span className="text-destructive">*</span>
                        </Label>
                        <Select
                          value={formData.unitsNeeded}
                          onValueChange={(value) => handleInputChange("unitsNeeded", value)}
                        >
                          <SelectTrigger id="unitsNeeded">
                            <SelectValue placeholder="Select units" />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num} unit{num > 1 ? "s" : ""}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Urgency Level */}
                <Card>
                  <CardHeader className="border-b">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                        <AlertCircle className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Urgency Level</CardTitle>
                        <CardDescription>How urgent is this blood request?</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid gap-3 sm:grid-cols-2">
                      {urgencyLevels.map((level) => (
                        <button
                          key={level.value}
                          type="button"
                          onClick={() => handleInputChange("urgency", level.value)}
                          className={`flex flex-col items-start rounded-lg border-2 p-4 text-left transition-all ${
                            formData.urgency === level.value
                              ? level.value === "critical"
                                ? "border-red-600 bg-red-50"
                                : level.value === "high"
                                ? "border-red-400 bg-red-50/50"
                                : level.value === "medium"
                                ? "border-amber-500 bg-amber-50"
                                : "border-green-500 bg-green-50"
                              : "border-border hover:border-muted-foreground/30 hover:bg-muted/50"
                          }`}
                        >
                          <span className={`font-medium ${
                            formData.urgency === level.value
                              ? level.value === "critical" || level.value === "high"
                                ? "text-red-700"
                                : level.value === "medium"
                                ? "text-amber-700"
                                : "text-green-700"
                              : "text-foreground"
                          }`}>
                            {level.label}
                          </span>
                          <span className="text-sm text-muted-foreground mt-1">
                            {level.description}
                          </span>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Hospital Information */}
                <Card>
                  <CardHeader className="border-b">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Hospital Information</CardTitle>
                        <CardDescription>Where should donors go for donation?</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="hospitalName">
                        Hospital or Clinic Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="hospitalName"
                        placeholder="Enter hospital or clinic name"
                        value={formData.hospitalName}
                        onChange={(e) => handleInputChange("hospitalName", e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="state">
                          State <span className="text-destructive">*</span>
                        </Label>
                        <Select
                          value={formData.state}
                          onValueChange={(value) => handleInputChange("state", value)}
                        >
                          <SelectTrigger id="state">
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            {states.map((state) => (
                              <SelectItem key={state} value={state}>
                                {state}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="city">
                          City <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="city"
                          placeholder="Enter city"
                          value={formData.city}
                          onChange={(e) => handleInputChange("city", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact and Timing */}
                <Card>
                  <CardHeader className="border-b">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Contact and Timing</CardTitle>
                        <CardDescription>How and when donors can reach you</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="contactPhone">
                          Contact Phone Number <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="contactPhone"
                          type="tel"
                          placeholder="e.g., +234 801 234 5678"
                          value={formData.contactPhone}
                          onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="neededDate">
                          Blood Needed By <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="neededDate"
                          type="date"
                          value={formData.neededDate}
                          onChange={(e) => handleInputChange("neededDate", e.target.value)}
                          min={new Date().toISOString().split("T")[0]}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="additionalNotes">
                        Additional Notes <span className="text-muted-foreground">(Optional)</span>
                      </Label>
                      <Textarea
                        id="additionalNotes"
                        placeholder="Any additional information for potential donors (e.g., specific instructions, parking details, ward number)"
                        value={formData.additionalNotes}
                        onChange={(e) => handleInputChange("additionalNotes", e.target.value)}
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-6 space-y-6">
                  {/* Request Summary */}
                  <Card>
                    <CardHeader className="border-b">
                      <CardTitle className="text-base">Request Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Blood Type</span>
                          <span className="font-medium text-foreground">
                            {formData.bloodType || "Not selected"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Units Needed</span>
                          <span className="font-medium text-foreground">
                            {formData.unitsNeeded ? `${formData.unitsNeeded} unit${parseInt(formData.unitsNeeded) > 1 ? "s" : ""}` : "Not selected"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Urgency</span>
                          <span className={`font-medium capitalize ${
                            formData.urgency === "critical" ? "text-red-600" :
                            formData.urgency === "high" ? "text-red-500" :
                            formData.urgency === "medium" ? "text-amber-600" :
                            formData.urgency === "low" ? "text-green-600" :
                            "text-foreground"
                          }`}>
                            {formData.urgency || "Not selected"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Location</span>
                          <span className="font-medium text-foreground text-right text-sm">
                            {formData.city && formData.state 
                              ? `${formData.city}, ${formData.state}` 
                              : "Not specified"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Needed By</span>
                          <span className="font-medium text-foreground">
                            {formData.neededDate 
                              ? new Date(formData.neededDate).toLocaleDateString("en-MY", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })
                              : "Not specified"}
                          </span>
                        </div>
                      </div>

                      <div className="mt-6 pt-6 border-t border-border">
                        <Button 
                          type="submit" 
                          className="w-full" 
                          size="lg"
                          disabled={!isFormValid || isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              <Droplet className="mr-2 h-4 w-4" />
                              Submit Blood Request
                            </>
                          )}
                        </Button>
                        <p className="text-xs text-center text-muted-foreground mt-3">
                          Your request will be visible to matching donors in your area
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Help Card */}
                  <Card className="bg-muted/50">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 shrink-0">
                          <MapPin className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground text-sm">How matching works</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Once submitted, your request will be matched with available donors in your selected location who have compatible blood types. Donors will be notified and can choose to respond.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </form>
    </>
  )
}
