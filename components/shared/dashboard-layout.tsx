"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Droplet, LogOut, Menu, X } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export interface NavItem {
  name: string
  href: string
  icon: LucideIcon
}

interface DashboardLayoutProps {
  children: React.ReactNode
  navigation: NavItem[]
  userType: "donor" | "requester" | "admin"
}

export function DashboardLayout({ children, navigation, userType }: DashboardLayoutProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const baseHref = `/${userType}/dashboard`
  const menuLabel = userType === "admin" ? "Administration" : "Menu"

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border bg-card px-4 lg:hidden">
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
          onClick={() => setMobileMenuOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <Menu className="h-6 w-6" />
        </button>
        <Link href={baseHref} className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Droplet className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold text-foreground">LifeLink</span>
        </Link>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-72 bg-card shadow-xl">
            <div className="flex h-16 items-center justify-between border-b border-border px-4">
              <Link href={baseHref} className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Droplet className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="text-lg font-semibold text-foreground">LifeLink</span>
              </Link>
              <button
                type="button"
                className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-1 p-4">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
            <div className="absolute bottom-0 left-0 right-0 border-t border-border p-4">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
                asChild
              >
                <Link href="/login">
                  <LogOut className="h-5 w-5" />
                  Sign Out
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:w-64 lg:flex-col">
        <div className="flex h-full flex-col border-r border-border bg-card">
          <div className="flex h-16 items-center gap-2 border-b border-border px-6">
            <Link href={baseHref} className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Droplet className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold text-foreground">LifeLink</span>
            </Link>
          </div>

          <nav className="flex flex-1 flex-col gap-1 p-4">
            <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {menuLabel}
            </p>
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          <div className="border-t border-border p-4">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
              asChild
            >
              <Link href="/login">
                <LogOut className="h-5 w-5" />
                Sign Out
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="lg:pl-64">
        <div className="px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  )
}
