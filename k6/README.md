# k6 Load Testing

Performance tests for the application (Traefik → Backend → PostgreSQL primary/replica).
The requests decides to go to primary or replica via the @use_primary and @use_replica annotations in the backend.
@use_primary is used by default.

## Prerequisites

```bash
docker compose up --build --force-recreate
```

All tests seed 200 URLs during setup so VUs have UUIDs to read from.

## Tests

| Test | Purpose                                                 | VUs        | Duration | Command |
|---|---------------------------------------------------------|------------|---|---|
| `stress.js` | Find the breaking point by increasing VUs incrementally | 200 → 5000 | 7m | `docker compose run --rm k6 run /scripts/stress.js` |
| `rps-1000vu-20w-80r.js` | Max RPS with 20/80 write-to-read ratio                  | 1000       | 3m | `docker compose run --rm k6 run /scripts/rps-1000vu-20w-80r.js` |
| `rps-1000vu-50w-50r.js` | Max RPS with 50/50 write-to-read ratio                  | 1000       | 3m | `docker compose run --rm k6 run /scripts/rps-1000vu-50w-50r.js` |

## Traffic Distribution

- **stress.js** — 20% writes, 80% reads (read-heavy throughput)
- **rps-1000vu-50w-50r.js** — 50% writes, 50% reads (balanced throughput)
- **rps-1000vu-20w-80r.js** — 20% writes, 80% reads (read-heavy throughput)

## Key Metrics

- `http_req_duration` — response time (p95 is the most important)
- `http_req_failed` — error rate
- `read_duration` / `create_duration` — per-operation latency
- `created_urls` / `read_urls` — request counts
