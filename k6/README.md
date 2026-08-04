# k6 Load Testing

Performance tests for the application (Traefik → Backend → PostgreSQL primary/replica).
The requests decide to go to primary or replica via the `@use_primary` and `@use_replica` annotations in the backend.
`@use_primary` is used by default.

## Prerequisites

```bash
docker compose up --build --force-recreate
```

## Running Tests

Tests are triggered through the app UI. Open the Dashboard and use the K6 section to select and start a test.

During setup, `getRandomShortUrl(10000)` is called once and the resulting UUIDs are shared across all VUs via k6's shared data mechanism — eliminating per-VU HTTP calls for random URL fetching.

## Tests

| Test | Purpose | VUs | Duration |
|---|---|---|---|
| `stress.js` | Find the breaking point by increasing VUs incrementally | 200 → 30000 | ~10m |
| `rps-1000vu-20w-80r.js` | Max RPS with 20/80 write-to-read ratio | 1000 | 3m |
| `rps-1000vu-50w-50r.js` | Max RPS with 50/50 write-to-read ratio | 1000 | 3m |
| `db_stress.js` | Max RPS, random read-only, super read-heavy | 1000 | 5m |
| `long-rps-1000vu-20w-80r.js.js` | Long-running RPS with 20/80 write-to-read ratio | 1000 | 8h |

## Traffic Distribution

- **stress.js** — 20% writes, 80% reads (read-heavy throughput)
- **rps-1000vu-50w-50r.js** — 50% writes, 50% reads (balanced throughput)
- **rps-1000vu-20w-80r.js** — 20% writes, 80% reads (read-heavy throughput)
- **db_stress.js** — 100% reads from pre-fetched random short URLs
- **long-rps-1000vu-20w-80r.js.js** — 20% writes, 80% reads (read-heavy throughput)

## Key Metrics

- `http_req_duration` — response time (p95 is the most important)
- `http_req_failed` — error rate
- `test_progress` — test execution progress (0–100%)