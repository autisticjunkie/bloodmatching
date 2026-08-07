"use client"

import { DashboardLayout } from "@/components/shared/dashboard-layout"
import { LayoutDashboard, Plus, FileHeart, Users, MessageSquare } from "lucide-react"

const requesterNavigation = [
  { name: "Dashboard", href: "/requester/dashboard", icon: LayoutDashboard },
  { name: "Create Request", href: "/requester/create-request", icon: Plus },
  { name: "My Requests", href: "/requester/requests", icon: FileHeart },
  { name: "Matched Donors", href: "/requester/matched-donors", icon: Users },
  { name: "Messages", href: "/chat", icon: MessageSquare },
]

export default function RequesterLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout navigation={requesterNavigation} userType="requester">
      {children}
    </DashboardLayout>
  )
}
