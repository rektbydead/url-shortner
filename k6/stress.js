import http from "k6/http"
import {check, sleep} from "k6"

export const options = {
    stages: [
        // {duration: "30s", target: 500},
        {duration: "1m", target: 30000},
        // {duration: "2m", target: 1500},
        // {duration: "30s", target: 750},
        // {duration: "30s", target: 250},
    ]
}

const TRAEFIK_URL = "http://traefik:80"
const BASE_URL = `${TRAEFIK_URL}/api/shortner`
const uuidList = []

function createShortUrl() {
    const res = http.post(
        `${BASE_URL}/`,
        JSON.stringify({
            original_url: "https://example.com/",
            duration: 60,
        }),
        {
            headers: {
                "Content-Type": "application/json",
            },
        }
    )

    if (res.status === 200) {
        const body = res.json()
        uuidList.push(body.uuid)
    }
}

function search() {
    const uuid = uuidList[Math.floor(Math.random() * uuidList.length)]
    if (uuid === undefined) return

    const res = http.get(`${BASE_URL}/${uuid}`)

    check(res, {
        "GET 200": (r) => r.status === 200,
    })
}

function testFrontend() {
    const res = http.get(`${TRAEFIK_URL}/`)

    check(res, {
        "frontend 200": (r) => r.status === 200,
    })
}

export default function () {
    const r = Math.random()

    if (r < 0.05) {
        testFrontend()
    } else if (r < 0.15) {
        createShortUrl()
    } else {
        search()
    }

    sleep(1)
}