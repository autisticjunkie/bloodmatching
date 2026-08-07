"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Droplet, ArrowLeft, Loader2 } from "lucide-react"

const states = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT Abuja", "Gombe",
  "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara",
  "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau",
  "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
]

const requesterTypes = [
  { value: "individual", label: "Individual / Family Member" },
  { value: "hospital", label: "Hospital / Medical Center" },
  { value: "clinic", label: "Clinic" },
  { value: "blood_bank", label: "Blood Bank" },
  { value: "ngo", label: "NGO / Organization" },
]

export default function RequesterRegistrationPage() {
  const router = useRouter()
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    requesterType: "",
    organizationName: "",
    state: "",
    city: "",
  })

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError("")
  }

  const showOrganizationField = formData.requesterType && formData.requesterType !== "individual"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Validate passwords match
    if (!formData.password || !formData.confirmPassword) {
      setError("Please enter both password fields")
      setIsLoading(false)
      return
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/register/requester", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          requesterType: formData.requesterType,
          organizationName: formData.organizationName || undefined,
          state: formData.state,
          city: formData.city,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        const msg = data.errors?.[0]?.message || data.message || "Registration failed"
        throw new Error(msg)
      }

      // Redirect to login
      router.push("/login?registered=true")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Simple Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Droplet className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold text-foreground">LifeLink</span>
          </Link>
          <Link 
            href="/" 
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Request Blood</CardTitle>
            <CardDescription>
              Create an account to post blood requests and connect with verified donors in your area.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {error && (
                <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              {/* Account Information Section */}
              <div className="flex flex-col gap-4">
                <h3 className="text-sm font-medium text-foreground">Account Information</h3>
                
                <div className="flex flex-col gap-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input 
                    id="fullName" 
                    type="text" 
                    placeholder="Enter your full name" 
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    required 
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="you@example.com" 
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    required 
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    placeholder="+234 801 234 5678" 
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    required 
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="password">Password *</Label>
                    <Input 
                      id="password" 
                      name="password"
                      type="password" 
                      autoComplete="new-password"
                      placeholder="Create a password" 
                      value={formData.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      required 
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input 
                      id="confirmPassword" 
                      name="confirmPassword"
                      type="password" 
                      autoComplete="new-password"
                      placeholder="Confirm your password" 
                      value={formData.confirmPassword}
                      onChange={(e) => handleChange("confirmPassword", e.target.value)}
                      required 
                    />
                  </div>
                </div>
              </div>

              {/* Requester Information Section */}
              <div className="flex flex-col gap-4 border-t border-border pt-6">
                <h3 className="text-sm font-medium text-foreground">Requester Information</h3>
                
                <div className="flex flex-col gap-2">
                  <Label htmlFor="requesterType">Requester Type *</Label>
                  <Select 
                    required
                    value={formData.requesterType}
                    onValueChange={(value) => handleChange("requesterType", value)}
                  >
                    <SelectTrigger id="requesterType" className="w-full">
                      <SelectValue placeholder="Select requester type" />
                    </SelectTrigger>
                    <SelectContent>
                      {requesterTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Select whether you are requesting as an individual or on behalf of an organization
                  </p>
                </div>

                {showOrganizationField && (
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="organizationName">
                      {formData.requesterType === "hospital" ? "Hospital Name *" : 
                       formData.requesterType === "clinic" ? "Clinic Name *" : 
                       formData.requesterType === "blood_bank" ? "Blood Bank Name *" : 
                       "Organization Name *"}
                    </Label>
                    <Input 
                      id="organizationName" 
                      type="text" 
                      placeholder={
                        formData.requesterType === "hospital" ? "Enter hospital name" : 
                        formData.requesterType === "clinic" ? "Enter clinic name" : 
                        formData.requesterType === "blood_bank" ? "Enter blood bank name" : 
                        "Enter organization name"
                      }
                      value={formData.organizationName}
                      onChange={(e) => handleChange("organizationName", e.target.value)}
                      required 
                    />
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="state">State *</Label>
                    <Select 
                      required
                      value={formData.state}
                      onValueChange={(value) => handleChange("state", value)}
                    >
                      <SelectTrigger id="state" className="w-full">
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
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="city">City *</Label>
                    <Input 
                      id="city" 
                      type="text" 
                      placeholder="Enter your city" 
                      value={formData.city}
                      onChange={(e) => handleChange("city", e.target.value)}
                      required 
                    />
                  </div>
                </div>
              </div>

              {/* Agreement Section */}
              <div className="flex flex-col gap-4 border-t border-border pt-6">
                <div className="flex items-start gap-3">
                  <Checkbox 
                    id="terms" 
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                  />
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="terms" className="text-sm font-normal leading-relaxed">
                      I agree to the{" "}
                      <Link href="/terms" className="text-primary underline-offset-4 hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-primary underline-offset-4 hover:underline">
                        Privacy Policy
                      </Link>
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      I understand that this platform connects requesters with donors and does not guarantee blood availability.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                size="lg" 
                className="w-full"
                disabled={!agreedToTerms || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Requester Account"
                )}
              </Button>

              {/* Sign In Link */}
              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="font-medium text-primary hover:underline">
                  Sign in
                </Link>
              </p>

              {/* Donor Link */}
              <p className="text-center text-sm text-muted-foreground">
                Want to donate blood instead?{" "}
                <Link href="/register/donor" className="font-medium text-primary hover:underline">
                  Register as a donor
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
