import { useCallback } from "react"
import { useTheme } from "@/components/theme-provider.tsx"

export function GrafanaPanel({ panelId, title, }: { panelId: number, title: string }) {
  const { theme } = useTheme()
  const resolvedTheme =
    theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme

  const GRAFANA_BASE = "http://localhost/grafana/d-solo/url-shortener/url-shortener"
  const src = `${GRAFANA_BASE}?orgId=1&panelId=${panelId}&kiosk&theme=${resolvedTheme}&from=now-60m&to=now&refresh=10s`

  const handleLoad = useCallback((e: React.SyntheticEvent<HTMLIFrameElement>) => {
      const document = e.currentTarget.contentDocument
      if (document === null) return
      const style = document.createElement("style")
      style.textContent = "[class*='panel-menu'], [class*='panel-header'] button { display: none !important; }"
      document.head.appendChild(style)
    }, [])

  return (
    <iframe
      src={src}
      height={250}
      frameBorder="0"
      scrolling="no"
      className="w-full"
      title={title}
      onLoad={handleLoad}
    />
  )
}
