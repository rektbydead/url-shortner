export interface K6StatusData {
  status: "idle" | "starting" | "running" | "ended" | "stopped"
  test?: string
  exit_code?: number
  started_at?: string
  error?: string
}

type K6Listener = (data: K6StatusData) => void

let ws: WebSocket | null = null
const listeners: Set<K6Listener> = new Set()
let reconnectTimer: ReturnType<typeof setTimeout> | null = null
let intentionalClose = false

function getWebSocketUrl(): string {
  const base = import.meta.env.VITE_APP_AXIOS_BASE_URL ?? "/api/"
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:"
  return `${protocol}//${window.location.host}${base}k6/ws`
}

function connect() {
  if (ws) return

  ws = new WebSocket(getWebSocketUrl())

  ws.onopen = () => {
    ws!.send(JSON.stringify({ action: "status" }))
  }

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data)
      listeners.forEach((fn) => fn(data as K6StatusData))
    } catch {
      // ignore non-JSON messages
    }
  }

  ws.onclose = () => {
    ws = null
    if (intentionalClose) {
      intentionalClose = false
      return
    }
    reconnectTimer = setTimeout(connect, 3000)
  }

  ws.onerror = () => {
    ws?.close()
  }
}

function send(payload: Record<string, string>) {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(payload))
  }
}

export function startTest(testName: string) {
  send({ action: "start", test: testName })
}

export function stopTest() {
  send({ action: "stop" })
}

export function requestStatus() {
  send({ action: "status" })
}

export function subscribeK6(listener: K6Listener): () => void {
  listeners.add(listener)
  connect()

  return () => {
    listeners.delete(listener)
    if (listeners.size === 0) {
      if (reconnectTimer) clearTimeout(reconnectTimer)
      intentionalClose = true
      ws?.close()
      ws = null
    }
  }
}
