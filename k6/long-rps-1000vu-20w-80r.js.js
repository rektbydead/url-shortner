import { check, sleep } from "k6"
import {setup, createShortUrl, readShortUrl, hitFrontend, randomUuid, getRandomShortUrl} from "./helpers.js"

export { setup }

export const options = {
    stages: [
        { duration: "8h", target: 1000 },
    ],
    thresholds: {
        http_req_duration: ["p(95)<2000"],
        http_req_failed: ["rate<0.10"],
    },
}

// Stress test - finds the breaking point by increasing VUs per minute.
// Go from 200 to 5000 VUs over 8 hours.
// The breaking point is reached when p95 latency spikes or errors appear.
export default function (data) {
    const random = Math.random()

    if (random < 0.20) {
        return createShortUrl()
    }

    const uuid = randomUuid(data.uuids)
    if (uuid) {
        const res = readShortUrl(uuid)
        check(res, { "GET 200": (r) => r.status === 200 })
    }
}