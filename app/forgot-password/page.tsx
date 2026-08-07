"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AuthLayout } from "@/components/shared/auth-layout"
import { Loader2, MailCheck, ArrowLeft } from "lucide-react"
import { isValidEmail } from "@/lib/validations"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email.trim()) {
      setError("Enter the email address registered to your account")
      return
    }
    if (!isValidEmail(email)) {
      setError("Enter a valid email address")
      return
    }

    setIsSubmitting(true)
    // Give the user visible feedback before showing the confirmation panel.
    await new Promise((resolve) => setTimeout(resolve, 600))
    setIsSubmitting(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <AuthLayout
        title="Check your email"
        description="Password recovery instructions have been requested"
      >
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <MailCheck className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-2">
              <p className="font-medium text-foreground">
                If an account exists for {email}, recovery instructions will be sent to that
                address.
              </p>
              <p className="text-sm text-muted-foreground">
                Recovery links expire one hour after they are issued. Check your spam folder if
                nothing arrives within a few minutes.
              </p>
            </div>
            <div className="flex w-full flex-col gap-2 pt-2">
              <Button asChild className="w-full">
                <Link href="/login">Return to sign in</Link>
              </Button>
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => {
                  setSubmitted(false)
                  setEmail("")
                }}
              >
                Use a different email address
              </Button>
            </div>
          </CardContent>
        </Card>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Reset your password"
      description="We will send recovery instructions to your registered email address"
    >
      <Card>
        <CardHeader>
          <CardTitle>Forgot password</CardTitle>
          <CardDescription>
            Enter the email address you registered with and we will send you a link to choose a
            new password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setError("")
                }}
                disabled={isSubmitting}
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending instructions
                </>
              ) : (
                "Send recovery link"
              )}
            </Button>
          </form>

          <div className="mt-6 border-t border-border pt-4">
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
