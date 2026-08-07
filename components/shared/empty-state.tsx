import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  actionLabel?: string
  actionHref?: string
  actionIcon?: LucideIcon
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  actionIcon: ActionIcon,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 text-center", className)}>
      <Icon className="h-12 w-12 text-muted-foreground/50" />
      <p className="mt-4 font-medium text-foreground">{title}</p>
      {description && (
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      )}
      {actionLabel && actionHref && (
        <Button className="mt-4" asChild>
          <Link href={actionHref}>
            {ActionIcon && <ActionIcon className="mr-2 h-4 w-4" />}
            {actionLabel}
          </Link>
        </Button>
      )}
    </div>
  )
}
