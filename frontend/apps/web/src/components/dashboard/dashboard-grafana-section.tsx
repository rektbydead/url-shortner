import { DashboardTitle } from "@/components/dashboard-title.tsx"
import { GrafanaPanel } from "@/components/dashboard/grafana-panel.tsx"

export default function DashboardGrafanaSection() {
  const PANELS = [
    { id: 1, title: "Requests / sec", query: "reqps" },
    { id: 2, title: "Error Rate", query: "reqps" },
    { id: 3, title: "Total Requests", query: "short" },
    { id: 4, title: "Latency P50", query: "s" },
    { id: 5, title: "Latency P95", query: "s" },
    { id: 6, title: "Latency P99", query: "s" },
  ] as const

  return (
    <section className="flex flex-col gap-2">
      <DashboardTitle
        title={"Dashboard"}
        subtitle={"Real-time metrics from Prometheus via Grafana"}
      />

      <div className="grid grid-cols-5 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {PANELS.map((panel) => (
          <GrafanaPanel key={panel.id} panelId={panel.id} title={panel.title} />
        ))}
      </div>
    </section>
  )
}
