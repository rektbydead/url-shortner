import {check} from "k6"
import {createShortUrl, randomUuid, readShortUrl, setup, updateProgress} from "./helpers.js"

export {setup}

export const options = {
    stages: [
        { duration: "1m", target: 200 },
        { duration: "1m", target: 500 },
        { duration: "1m", target: 1000 },
        { duration: "1m", target: 2000 },
        { duration: "1m", target: 3000 },
        { duration: "1m", target: 5000 },
        { duration: "1m", target: 10000 },
        { duration: "1m", target: 15000 },
        { duration: "1m", target: 20000 },
        { duration: "1m", target: 30000 },
    ],
    thresholds: {
        http_req_duration: ["p(95)<2000"],
        http_req_failed: ["rate<0.10"],
    },
}

export default function (data) {
    updateProgress()

    const random = Math.random()

    if (random < 0.20) {
        return createShortUrl()
    }

    const uuid = randomUuid(data.randomShortUrls)
    if (uuid) {
        const res = readShortUrl(uuid)
        check(res, {"GET 200": (r) => r.status === 200})
    }
}