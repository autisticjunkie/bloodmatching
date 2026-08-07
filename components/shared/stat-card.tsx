import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  iconClassName?: string
  iconBgClassName?: string
  href?: string
  badge?: number
}

export function StatCard({
  title,
  value,
  icon: Icon,
  iconClassName = "text-primary",
  iconBgClassName = "bg-primary/10",
  href,
  badge,
}: StatCardProps) {
  const content = (
    <div className="flex items-center gap-4">
      <div className={cn("relative flex h-12 w-12 items-center justify-center rounded-full", iconBgClassName)}>
        <Icon className={cn("h-6 w-6", iconClassName)} />
        {badge !== undefined && badge > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
            {badge > 9 ? "9+" : badge}
          </span>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold text-foreground">{typeof value === "number" ? value.toLocaleString() : value}</p>
      </div>
    </div>
  )

  return (
    <Card>
      <CardContent className="pt-6">
        {href ? (
          <Link href={href} className="block">
            {content}
          </Link>
        ) : (
          content
        )}
      </CardContent>
    </Card>
  )
}

interface StatCardSmallProps {
  title: string
  value: string | number
  icon: LucideIcon
  iconClassName?: string
  iconBgClassName?: string
}

export function StatCardSmall({
  title,
  value,
  icon: Icon,
  iconClassName = "text-primary",
  iconBgClassName = "bg-primary/10",
}: StatCardSmallProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-3">
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-full", iconBgClassName)}>
            <Icon className={cn("h-5 w-5", iconClassName)} />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">{title}</p>
            <p className="text-xl font-bold text-foreground">{typeof value === "number" ? value.toLocaleString() : value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
