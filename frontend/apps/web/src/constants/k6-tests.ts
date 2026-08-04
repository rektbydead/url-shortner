export const K6_TESTS = [
  {
    value: "stress.js",
    label: "Stress Test",
    description: "Find breaking point, 200→30k VUs, 10min",
  },
  {
    value: "rps-1000vu-20w-80r.js",
    label: "RPS 20/80",
    description: "Max RPS, 1000 VUs, read-heavy, 3min",
  },
  {
    value: "rps-1000vu-50w-50r.js",
    label: "RPS 50/50",
    description: "Max RPS, 1000 VUs, balanced, 3min",
  },
  {
    value: "db_stress.js",
    label: "Database Stress Test",
    description: "Max RPS, 1000 VUs, random-read-only, super-read-heavy, 5min",
  },
  {
    value: "long-rps-1000vu-20w-80r.js.js",
    label: "Long RPS 20/80",
    description: "Long-running RPS, 1000 VUs, read-heavy, 8h",
  },
]
