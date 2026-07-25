import { check } from "k6"
import { setup, createShortUrl, readShortUrl, randomUuid } from "./helpers.js"

export { setup }

export const options = {
    stages: [
        { duration: "3m", target: 1000 },
    ],
    thresholds: {
        http_req_failed: ["rate<0.01"],
    },
}

// RPS test — measures maximum requests per second.
// 1000 VUs with no sleep, 50/50 write-to-read ratio.
// Look for http_reqs/s - the higher, the better
export default function (data) {
    const random = Math.random()

    if (random < 0.50) {
        return createShortUrl()
    }

    const uuid = randomUuid(data.uuids)
    if (uuid) {
        const res = readShortUrl(uuid)
        check(res, { "GET 200": (r) => r.status === 200 })
    }
}
