"use client"

import { DashboardLayout } from "@/components/shared/dashboard-layout"
import { LayoutDashboard, Users, FileHeart, UserCheck, MessageSquare, Settings } from "lucide-react"

const adminNavigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Requests", href: "/admin/requests", icon: FileHeart },
  { name: "Verifications", href: "/admin/verifications", icon: UserCheck },
  { name: "Messages", href: "/admin/messages", icon: MessageSquare },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout navigation={adminNavigation} userType="admin">
      {children}
    </DashboardLayout>
  )
}
