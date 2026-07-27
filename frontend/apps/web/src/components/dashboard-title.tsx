import type { DashboardTitleType } from "@/schemas/components/dashboard-title-type.ts"

export function DashboardTitle({ title, subtitle }: DashboardTitleType) {
  return (
    <div>
      <h1 className="text-lg font-semibold tracking-tight text-foreground">
        {title}
      </h1>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </div>
  )
}
