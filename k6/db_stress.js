import { check, sleep } from "k6"
import {setup, readShortUrl, randomUuid, updateProgress, getRandomShortUrl} from "./helpers.js"

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

export default function (data) {
    updateProgress()

    const res = getRandomShortUrl(1000)
    check(res, { "GET 200": (r) => r.status === 200 })
}