"use client"

import { DashboardLayout } from "@/components/shared/dashboard-layout"
import { LayoutDashboard, User, FileHeart, MessageSquare } from "lucide-react"

const donorNavigation = [
  { name: "Dashboard", href: "/donor/dashboard", icon: LayoutDashboard },
  { name: "My Profile", href: "/donor/profile", icon: User },
  { name: "Blood Requests", href: "/donor/requests", icon: FileHeart },
  { name: "Messages", href: "/chat", icon: MessageSquare },
]

export default function DonorLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout navigation={donorNavigation} userType="donor">
      {children}
    </DashboardLayout>
  )
}
