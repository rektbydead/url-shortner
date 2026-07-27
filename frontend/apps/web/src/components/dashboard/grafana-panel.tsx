export function GrafanaPanel({ panelId, title }: { panelId: number; title: string }) {
  const GRAFANA_BASE = "http://localhost/grafana/d-solo/url-shortener/url-shortener"
  const src = `${GRAFANA_BASE}?orgId=1&panelId=${panelId}&kiosk`

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-border">
      <div className="border-b border-border px-3 py-1.5">
        <h3 className="text-xs font-medium text-muted-foreground">{title}</h3>
      </div>
      <iframe
        src={src}
        width="100%"
        height="250"
        frameBorder="0"
        scrolling="no"
        className="pointer-events-none w-full"
        title={title}
      />
    </div>
  )
}
