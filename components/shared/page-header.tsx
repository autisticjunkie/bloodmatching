import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { LucideIcon } from "lucide-react"

interface PageHeaderProps {
  title: string
  description?: string
  actionLabel?: string
  actionHref?: string
  actionIcon?: LucideIcon
  children?: React.ReactNode
}

export function PageHeader({
  title,
  description,
  actionLabel,
  actionHref,
  actionIcon: ActionIcon,
  children,
}: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
        {description && (
          <p className="mt-1 text-muted-foreground">{description}</p>
        )}
      </div>
      {actionLabel && actionHref ? (
        <Button asChild>
          <Link href={actionHref}>
            {ActionIcon && <ActionIcon className="mr-2 h-4 w-4" />}
            {actionLabel}
          </Link>
        </Button>
      ) : (
        children
      )}
    </div>
  )
}
