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

const bloodTypes = [
  { label: "A+", value: "A+" },
  { label: "A-", value: "A-" },
  { label: "B+", value: "B+" },
  { label: "B-", value: "B-" },
  { label: "AB+", value: "AB+" },
  { label: "AB-", value: "AB-" },
  { label: "O+", value: "O+" },
  { label: "O-", value: "O-" },
]

const states = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT Abuja", "Gombe",
  "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara",
  "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau",
  "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
]

export default function DonorRegistrationPage() {
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
    gender: "",
    bloodType: "",
    state: "",
    city: "",
    lastDonationDate: "",
  })

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Validate passwords match
    console.log("Password debug:", JSON.stringify(formData.password), "vs", JSON.stringify(formData.confirmPassword))
    if (!formData.password || !formData.confirmPassword) {
      setError(`Please enter both password fields (password: ${formData.password.length} chars, confirm: ${formData.confirmPassword.length} chars)`)
      setIsLoading(false)
      return
    }
    if (formData.password !== formData.confirmPassword) {
      setError(`Passwords do not match (password: ${formData.password.length} chars, confirm: ${formData.confirmPassword.length} chars)`)
      setIsLoading(false)
      return
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/register/donor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          bloodType: formData.bloodType,
          state: formData.state,
          city: formData.city,
          gender: formData.gender || undefined,
          lastDonationDate: formData.lastDonationDate || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        const msg = data.errors?.[0]?.message || data.message || "Registration failed"
        throw new Error(msg)
      }

      // Redirect to donor dashboard on success
      router.push("/donor/dashboard")
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
            <CardTitle className="text-2xl">Become a Blood Donor</CardTitle>
            <CardDescription>
              Join our community of life-savers. Fill in your details below to register as a donor.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {error && (
                <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              {/* Personal Information Section */}
              <div className="flex flex-col gap-4">
                <h3 className="text-sm font-medium text-foreground">Personal Information</h3>
                
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

                <div className="flex flex-col gap-2">
                  <Label htmlFor="gender">Gender (Optional)</Label>
                  <Select value={formData.gender} onValueChange={(value) => handleChange("gender", value)}>
                    <SelectTrigger id="gender" className="w-full">
                      <SelectValue placeholder="Select your gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Donor Information Section */}
              <div className="flex flex-col gap-4 border-t border-border pt-6">
                <h3 className="text-sm font-medium text-foreground">Donor Information</h3>
                
                <div className="flex flex-col gap-2">
                  <Label htmlFor="bloodType">Blood Type *</Label>
                  <Select value={formData.bloodType} onValueChange={(value) => handleChange("bloodType", value)} required>
                    <SelectTrigger id="bloodType" className="w-full">
                      <SelectValue placeholder="Select your blood type" />
                    </SelectTrigger>
                    <SelectContent>
                      {bloodTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="state">State *</Label>
                    <Select value={formData.state} onValueChange={(value) => handleChange("state", value)} required>
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

                <div className="flex flex-col gap-2">
                  <Label htmlFor="lastDonation">Last Donation Date (Optional)</Label>
                  <Input 
                    id="lastDonation" 
                    type="date" 
                    value={formData.lastDonationDate}
                    onChange={(e) => handleChange("lastDonationDate", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Leave blank if you have never donated before
                  </p>
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
                      I confirm that the information provided is accurate and I am eligible to donate blood.
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
                  "Create Donor Account"
                )}
              </Button>

              {/* Sign In Link */}
              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="font-medium text-primary hover:underline">
                  Sign in
                </Link>
              </p>

              {/* Requester Link */}
              <p className="text-center text-sm text-muted-foreground">
                Need blood instead?{" "}
                <Link href="/register/requester" className="font-medium text-primary hover:underline">
                  Register as a requester
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
