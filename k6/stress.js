import http from "k6/http"
import {check, sleep} from "k6"

export const options = {
    stages: [
        {duration: "30s", target: 50},
        {duration: "1m", target: 200},
        {duration: "2m", target: 200},
        {duration: "30s", target: 0},
    ]
}

const BASE_URL = "http://backend:8000/shortner"
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

    const body = res.json()
    uuidList.push(body.uuid)
}

function search() {
    const uuid = uuidList[Math.floor(Math.random() * uuidList.length)]
    if (uuid === undefined) return

    const res = http.get(`${BASE_URL}/${uuid}`)

    check(res, {
        "GET 200": (r) => r.status === 200,
    })
}

export default function () {
    if (Math.random() < 0.1) {
        createShortUrl()
    } else {
         search()
    }

    sleep(1)
}