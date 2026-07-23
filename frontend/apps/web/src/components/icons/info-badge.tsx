import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"

interface InfoBadgeProps {
  icon: LucideIcon
  children: ReactNode
}

export function InfoBadge({ icon: Icon, children }: InfoBadgeProps) {
  return (
    <span className="flex items-center gap-1.5">
      <Icon className="size-3" />
      {children}
    </span>
  )
}
