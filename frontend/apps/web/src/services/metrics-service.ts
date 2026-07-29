export interface MetricsData {
  requests_per_second: number | null
  latency_p50: number | null
  latency_p95: number | null
  latency_p99: number | null
  error_rate: number | null
  total_requests: number | null
}

type MetricsListener = (data: MetricsData) => void

let eventSource: EventSource | null = null
let listeners: Set<MetricsListener> = new Set()

function getStreamUrl(): string {
  const base = import.meta.env.VITE_APP_AXIOS_BASE_URL ?? "/api/"
  return `${base}metrics/stream`
}

function connect() {
  if (eventSource) return

  eventSource = new EventSource(getStreamUrl())

  eventSource.onmessage = (event) => {
    try {
      const data: MetricsData = JSON.parse(event.data)
      listeners.forEach((fn) => fn(data))
    } catch {
      // ignore malformed events
    }
  }

  eventSource.onerror = () => {
    eventSource?.close()
    eventSource = null
    setTimeout(connect, 3000)
  }
}

export function subscribeMetrics(listener: MetricsListener): () => void {
  listeners.add(listener)
  connect()

  return () => {
    listeners.delete(listener)
    if (listeners.size === 0 && eventSource) {
      eventSource.close()
      eventSource = null
    }
  }
}
