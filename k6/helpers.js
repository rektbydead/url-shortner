import exec from "k6/execution"
import http from "k6/http"
import {Gauge} from "k6/metrics"

export const TRAEFIK_URL = "http://traefik:80"
export const BASE_URL = `${TRAEFIK_URL}/api/shortner`

export const testProgress = new Gauge("test_progress")

export function updateProgress() {
    testProgress.add(exec.scenario.progress)
}

export function setup() {
    const randomShortUrls = []

    const randomRes = getRandomShortUrl(10000)
    if (randomRes.status === 200) {
        const data = randomRes.json()
        for (const item of data) {
            randomShortUrls.push(item.uuid)
        }
    }

    return {randomShortUrls}
}

export function createShortUrl() {
    return http.post(
        `${BASE_URL}/`,
        JSON.stringify({
            original_url: "https://example.com/",
            duration: Math.floor(Math.random() * 300) + 1,
        }),
        {headers: {"Content-Type": "application/json"}}
    )
}

export function readShortUrl(uuid) {
    return http.get(`${BASE_URL}/${uuid}`)
}

export function randomUuid(uuids) {
    if (!uuids || uuids.length === 0) return null
    return uuids[Math.floor(Math.random() * uuids.length)]
}

export function getRandomShortUrl(numberOfEntries) {
    return http.get(`${BASE_URL}/random/${numberOfEntries}`)
}