import { useEffect, useState } from "react"
import { Header } from "@/components/header.tsx"
import { Footer } from "@/components/footer.tsx"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { subscribeMetrics, type MetricsData } from "@/services/metrics-service.ts"
import { Activity, Clock, AlertTriangle, BarChart3, TrendingUp, ExternalLink } from "lucide-react"

const GRAFANA_BASE = "http://localhost:3000"

function grafanaPanel(panelId: number): string {
  return `${GRAFANA_BASE}/d-solo/url-shortener/url-shortener?orgId=1&panelId=${panelId}&kiosk&from=now-1h&to=now&refresh=5s`
}

function formatNumber(value: number | null, decimals = 2): string {
  if (value === null) return "--"
  return Number(value).toFixed(decimals)
}

function MetricCard({
  title,
  value,
  unit,
  icon: Icon,
}: {
  title: string
  value: string
  unit: string
  icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-muted-foreground">
          <Icon className="size-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold tracking-tight text-foreground">
            {value}
          </span>
          <span className="text-xs text-muted-foreground">{unit}</span>
        </div>
      </CardContent>
    </Card>
  )
}

function GrafanaPanel({ title, panelId }: { title: string; panelId: number }) {
  return (
    <div className="overflow-hidden rounded-lg ring-1 ring-foreground/10">
      <iframe
        src={grafanaPanel(panelId)}
        width="100%"
        height="300"
        frameBorder="0"
        loading="lazy"
        className="pointer-events-none"
        title={title}
      />
    </div>
  )
}

export default function Metrics() {
  const [metrics, setMetrics] = useState<MetricsData | null>(null)

  useEffect(() => {
    return subscribeMetrics(setMetrics)
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-6">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Metrics Dashboard
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Live metrics streamed from the backend via Prometheus.
            </p>
          </div>
          <a
            href={`${GRAFANA_BASE}/d/url-shortener/url-shortener?orgId=1`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            Open in Grafana
            <ExternalLink className="size-3" />
          </a>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <MetricCard
            title="Requests / sec"
            value={formatNumber(metrics?.requests_per_second ?? null)}
            unit="req/s"
            icon={Activity}
          />
          <MetricCard
            title="Total Requests (5m)"
            value={formatNumber(metrics?.total_requests ?? null, 0)}
            unit="requests"
            icon={BarChart3}
          />
          <MetricCard
            title="Error Rate (5xx)"
            value={formatNumber(metrics?.error_rate ?? null, 4)}
            unit="req/s"
            icon={AlertTriangle}
          />
          <MetricCard
            title="Latency P50"
            value={formatNumber(metrics?.latency_p50 ?? null, 4)}
            unit="s"
            icon={Clock}
          />
          <MetricCard
            title="Latency P95"
            value={formatNumber(metrics?.latency_p95 ?? null, 4)}
            unit="s"
            icon={Clock}
          />
          <MetricCard
            title="Latency P99"
            value={formatNumber(metrics?.latency_p99 ?? null, 4)}
            unit="s"
            icon={TrendingUp}
          />
        </div>

        <div className="mt-8 space-y-6">
          <div>
            <h2 className="mb-3 text-lg font-semibold tracking-tight text-foreground">
              Traffic
            </h2>
            <div className="grid gap-4 lg:grid-cols-2">
              <GrafanaPanel title="Requests per second" panelId={1} />
              <GrafanaPanel title="Requests by method" panelId={4} />
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-lg font-semibold tracking-tight text-foreground">
              Latency
            </h2>
            <div className="grid gap-4 lg:grid-cols-3">
              <GrafanaPanel title="Latency P50" panelId={5} />
              <GrafanaPanel title="Latency P95" panelId={6} />
              <GrafanaPanel title="Latency P99" panelId={7} />
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-lg font-semibold tracking-tight text-foreground">
              Errors
            </h2>
            <div className="grid gap-4 lg:grid-cols-2">
              <GrafanaPanel title="Error rate" panelId={8} />
              <GrafanaPanel title="Requests by status" panelId={9} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
