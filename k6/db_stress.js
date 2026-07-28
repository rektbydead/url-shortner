import { check, sleep } from "k6"
import {setup, createShortUrl, readShortUrl, hitFrontend, randomUuid, getRandomShortUrl} from "./helpers.js"

export { setup }

export const options = {
    stages: [
        { duration: "5m", target: 1000 },
    ],
    thresholds: {
        http_req_duration: ["p(95)<2000"],
        http_req_failed: ["rate<0.10"],
    },
}

// Stress test - finds the breaking point by increasing VUs per minute.
// Go from 200 to 5000 VUs over 6 minutes (1 minute per stage).
// The breaking point is reached when p95 latency spikes or errors appear.
export default function (data) {
    const response = getRandomShortUrl(100)
    if (response) {
        check(response, { "GET 200": (r) => r.status === 200 })
    }
}