import {check} from "k6"
import {createShortUrl, randomUuid, readShortUrl, setup, updateProgress} from "./helpers.js"

export {setup}

export const options = {
    stages: [
        { duration: "3m", target: 1000 },
    ],
    thresholds: {
        http_req_failed: ["rate<0.01"],
    },
}

export default function (data) {
    updateProgress()

    const random = Math.random()

    if (random < 0.50) {
        return createShortUrl()
    }

    const uuid = randomUuid(data.randomShortUrls)
    if (uuid) {
        const res = readShortUrl(uuid)
        check(res, {"GET 200": (r) => r.status === 200})
    }
}