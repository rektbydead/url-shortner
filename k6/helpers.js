import exec from "k6/execution"
import http from "k6/http"
import {Counter, Trend, Gauge} from "k6/metrics"

export const TRAEFIK_URL = "http://traefik:80"
export const BASE_URL = `${TRAEFIK_URL}/api/shortner`

export const createdCount = new Counter("created_urls")
export const readCount = new Counter("read_urls")
export const frontendCount = new Counter("frontend_hits")
export const failedCount = new Counter("failed_requests")
export const createDuration = new Trend("create_duration", true)
export const readDuration = new Trend("read_duration", true)
export const readRandomDuration = new Trend("read_random_duration", true)
export const testProgress = new Gauge("test_progress")

export function updateProgress() {
    testProgress.add(exec.scenario.progress)
}

const SEED_COUNT = 200

export function setup() {
    const uuids = []

    for (let i = 0; i < SEED_COUNT; i++) {
        const res = http.post(
            `${BASE_URL}/`,
            JSON.stringify({
                original_url: `https://example.com/${i}`,
                duration: Math.floor(Math.random() * 300) + 1,
            }),
            {headers: {"Content-Type": "application/json"}}
        )

        if (res.status === 200) {
            uuids.push(res.json().uuid)
        }
    }

    return {uuids}
}

export function createShortUrl() {
    const res = http.post(
        `${BASE_URL}/`,
        JSON.stringify({
            original_url: "https://example.com/",
            duration: Math.floor(Math.random() * 300) + 1,
        }),
        {headers: {"Content-Type": "application/json"}}
    )

    createDuration.add(res.timings.duration)
    if (res.status === 200) {
        createdCount.add(1)
        return res.json().uuid
    }

    failedCount.add(1)
    return null
}

export function readShortUrl(uuid) {
    const res = http.get(`${BASE_URL}/${uuid}`)

    readDuration.add(res.timings.duration)

    if (res.status === 200) {
        readCount.add(1)
    } else {
        failedCount.add(1)
    }

    return res
}

export function hitFrontend() {
    const res = http.get(`${TRAEFIK_URL}/`)

    frontendCount.add(1)

    if (res.status !== 200) {
        failedCount.add(1)
    }

    return res
}

export function randomUuid(uuids) {
    if (!uuids || uuids.length === 0) return null
    return uuids[Math.floor(Math.random() * uuids.length)]
}

export function getRandomShortUrl(numberOfEntries) {
    const res = http.get(`${BASE_URL}/random/${numberOfEntries}`)

    readRandomDuration.add(res.timings.duration)

    if (res.status === 200) {
        readCount.add(1)
    } else {
        failedCount.add(1)
    }

    return res
}
