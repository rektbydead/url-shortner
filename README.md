<p align="center">
  <img src="https://img.shields.io/badge/URL%20Shortener-Ruben%20Lousada-6d28d9?style=for-the-badge&logo=link&logoColor=white" alt="URL Shortener" />
</p>

<h1 align="center">Lousada's URL Shortener</h1>

<p align="center">
  <i>Shorten URLs. Scale reads. Break things with k6.</i>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.14-3776AB?style=flat-square&logo=python&logoColor=white" alt="Python 3.14"/>
  <img src="https://img.shields.io/badge/FastAPI-0.139-009688?style=flat-square&logo=fastapi&logoColor=white" alt="FastAPI"/>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React 19"/>
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite 8"/>
  <img src="https://img.shields.io/badge/PostgreSQL-18-4169E1?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL 18"/>
  <img src="https://img.shields.io/badge/Traefik-3-24D1AC?style=flat-square&logo=traefikproxy&logoColor=white" alt="Traefik"/>
  <img src="https://img.shields.io/badge/Prometheus-Grafana-E6522C?style=flat-square&logo=prometheus&logoColor=white" alt="Prometheus/Grafana"/>
  <img src="https://img.shields.io/badge/k6-Load%20Testing-7D64FF?style=flat-square&logo=k6&logoColor=white" alt="k6"/>
  <img src="https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white" alt="Docker Compose"/>
</p>

---

## Overview

An **URL shortener** built as a PoC exercise in distributed systems. Every URL becomes a UUID that expires after a configurable lifetime, and a React frontend that communicates with the backend, which uses FastAPI. 
Postgres replicas and an embedded stress testing and observability stack.

### Why database replicas?

A URL shortener is mostly **read**, which lead me to assume the **1:10** read-write ratio. Every shortened link gets requested far more often than one is created, so a single database can become a bottleneck long.

This project is a **PoC for that scenario**: a PostgreSQL **primary + two streaming replicas**, with the backend splitting the traffic:

- **writes** → primary only
- **reads** → round-robin across the replicas

The **trade-off**: replicas are **eventually consistent** (a link created a moment ago may not be visible on a replica yet), in exchange for a large read-throughput win.

### Other things worth knowing

- **Dashboard with testing capabilities**: run k6 load tests from the browser (live progress over WebSocket) and embedded Grafana panels.
- **One test at a time**: It is not possible to have concurrent tests.
- **Dashboards auto-imports** — Grafana auto-imports its datasource and dashboard..

---

## Architecture

```
                        ┌───────────────────────────────────────────────┐
                        │                TRAEFIK (:80)                  │
                        │  /api      → backend  (strip /api prefix)     │
                        │  /         → frontend (nginx SPA)             │
                        │  /grafana/ → grafana                          │
                        └───────┬───────────────────┬───────────────────┘
                                │                   │
                    ┌───────────▼─────────┐   ┌─────▼───────────┐
                    │   backend ×2        │   │   frontend      │
                    │ FastAPI · gunicorn  │   │   nginx         │
                    │ 4 workers each      │   │                 │
                    └───────┬───────┬─────┘   └─────────────────┘
                            │       │
                    writes  │       │  reads (round-robin)
               ┌────────────▼───┐ ┌─▼───────────────────────────┐
               │ postgres-      │ │ postgres-replica-1          │
               │ primary        │ │ postgres-replica-2          │
               │ (writes/truth) │ │                             │
               └────────────────┘ └─────────────────────────────┘
```

<details>
<summary>How the k6 load testing fits in</summary>

The backend uses the **Docker SDK** to spawn a `grafana/k6` container on the Compose network. 
The React dashboard opens a **WebSocket** to the backend (`/api/k6/ws`) to get live status from the k6 REST API (`:6565`). You can start, monitor, and stop tests without leaving the browser.

</details>

---

## Quick Start

> **Estimated time:** ~3 minutes. Requires Docker + Docker Compose.

```bash
cp .env.template .env                                  # compose variables
cp backend/.env.template backend/.env                  # backend DB URLs
cp frontend/apps/web/.env.template frontend/apps/web/.env

docker compose up --build --force-recreate
```

Then open:

| URL                           | What you'll find                               |
|-------------------------------|------------------------------------------------|
| `http://localhost/`           | The URL shortener UI                           |
| `http://localhost/:uuid`      | The URL shortener redirection link             |
| `http://localhost/dashboard/` | K6 load-test control + embedded Grafana panels |
| `http://localhost/grafana/`   | Full Grafana                                   |

---

## Configuration Reference

### Root `.env` (used by Docker Compose)

| Variable | Description |
|---|---|
| `DATABASE_NAME` | PostgreSQL database name |
| `DATABASE_USER` | PostgreSQL application user |
| `DATABASE_PASSWORD` | PostgreSQL application password |
| `REPLICATOR_PASSWORD` | Password for the `replicator` replication user |

> **Important:** `REPLICATOR_PASSWORD` **must match** the password hardcoded in `postgresql/primary/init/01-replication-user.sql` (currently `replicator_password`). That script runs once on the primary's first boot to create the `replicator` user — if the `.env` value differs, `pg_basebackup` on the replicas will fail authentication.

### `backend/.env`

| Variable | Description |
|---|---|
| `WRITE_DATABASE_URL` | asyncpg URL to the primary (writes) |
| `READ_DATABASE_URLS` | JSON array of asyncpg URLs to the replicas (reads) |
| `K6_TESTS_DIRECTORY` | Absolute host path to `k6/` (mounted into k6 containers) |

> **Keep in sync:** `DATABASE_NAME`, `DATABASE_USER`, and `DATABASE_PASSWORD` in the root `.env` are embedded inside the backend connection URLs.


### `frontend/apps/web/.env`

| Variable | Description |
|---|---|
| `VITE_APP_AXIOS_BASE_URL` | `http://localhost/api/` behind Traefik |

---

## Usage

### Load Testing

Fire a k6 test straight from the browser: pick a script, hit **Run**, watch live **progress %**, **VUs**, and **total requests** stream in, and **Stop** whenever you like.

| Script | Scenario                                          | VUs | Duration |
|---|---------------------------------------------------|---|---|
| `stress.js` | Ramp-up to find the breaking point                | 200 → 30k | ~10m |
| `rps-1000vu-20w-80r.js` | Max RPS, 20% writes / 80% reads                   | 1000 | 3m |
| `rps-1000vu-50w-50r.js` | Max RPS, 50/50 write/read mix                     | 1000 | 3m |
| `db_stress.js` | Read-only random lookups (database heavy) | 1000 | 5m |
| `long-rps-1000vu-20w-80r.js.js` | Long-running read-heavy test                  | 1000 | 8h |

> Tests pre-fetch **10,000 random short URLs** once in k6 `setup()` and share them across all VUs.

### Observability

- **Prometheus** scrapes the backend `/metrics` and every PostgreSQL node every 5 seconds.
- **Grafana** serves a pre-provisioned **URL Shortener** dashboard, embedded right in the app: Requests/sec by Endpoint, Latency P50/P95/P99, PG Active Connections, PG Cache Hit Ratio.

---

## API Reference

Behind Traefik the base is `http://localhost/api` (prefix stripped). Running the backend directly it is `http://localhost:8000`.

| Method | Path | Description | Body | Response |
|---|---|---|---|---|
| `GET` | `/health` | Liveness check | — | `"Live"` |
| `POST` | `/shortner/` | Create a short URL | `{ "original_url", "duration" }` | `ShortUrl` |
| `GET` | `/shortner/{uuid}` | Resolve a link (replica read, 404 if expired) | — | `ShortUrl` |
| `GET` | `/shortner/random/{count}` | Random valid links (replica read) | — | `ShortUrl[]` |
| `GET` | `/metrics` | Prometheus metrics | — | `text/plain` |
| `WS` | `/k6/ws` | K6 control & monitoring | `{"action":"start","test":"stress.js"}` or `{"action":"stop"}` | status frames |

```jsonc
// ShortUrl response shape
{
  "uuid": "8f4e0b4f-…",
  "original_url": "https://example.com/",
  "expires_at": "2027-01-01T00:00:00Z"
}
```

---

## Roadmap

- [ ] **Base62 short codes** instead of UUIDs — `youtu.be/dQw4w9`-style links
- [ ] **Server-side 301 redirects** instead of client-side navigation
