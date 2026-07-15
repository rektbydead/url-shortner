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

export default function () {
    const res = http.get("http://backend:8000/shortner/d3e0fb69-aaf9-4162-a217-95bf7787b42a");

    check(res, {
        "status is 200": (r) => r.status === 200,
        "status is 404": (r) => r.status === 404,
    })

    sleep(1)
}