import { DashboardTitle } from "@/components/dashboard-title.tsx"
import { GrafanaPanel } from "@/components/dashboard/grafana-panel.tsx"

export default function DashboardGrafanaSection() {
  const PANELS = [
    {
      id: 7,
      title: "Requests / sec by Endpoint",
      className: "sm:col-span-2 lg:col-span-3",
    },
    { id: 4, title: "Latency P50" },
    { id: 5, title: "Latency P95" },
    { id: 6, title: "Latency P99" },
  ]

  return (
    <section className="flex flex-col gap-2">
      <DashboardTitle
        title={"Dashboard"}
        subtitle={"Real-time metrics from Prometheus via Grafana"}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PANELS.map((panel) => (
          <div key={panel.id} className={panel.className}>
            <GrafanaPanel panelId={panel.id} title={panel.title} />
          </div>
        ))}
      </div>
    </section>
  )
}
