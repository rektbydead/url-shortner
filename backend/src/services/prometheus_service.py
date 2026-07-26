import asyncio
import json

import httpx
from prometheus_client import generate_latest, CollectorRegistry, multiprocess


class PrometheusService:
    PROMETHEUS_URL = "http://prometheus:9090"
    QUERIES = {
        "requests_per_second": 'sum(rate(http_requests_total[1m]))',
        "latency_p50": 'histogram_quantile(0.50, sum(rate(http_request_duration_highr_seconds_bucket[5m])) by (le))',
        "latency_p95": 'histogram_quantile(0.95, sum(rate(http_request_duration_highr_seconds_bucket[5m])) by (le))',
        "latency_p99": 'histogram_quantile(0.99, sum(rate(http_request_duration_highr_seconds_bucket[5m])) by (le))',
        "error_rate": 'sum(rate(http_requests_total{status=~"5.."}[5m]))',
        "total_requests": 'sum(increase(http_requests_total[5m]))',
    }

    async def _fetch_all_metrics(self):
        async with httpx.AsyncClient() as client:
            results = {}
            for name, query in self.QUERIES.items():
                r = await client.get(
                    f"{self.PROMETHEUS_URL}/api/v1/query",
                    params={"query": query}
                )
                data = r.json()["data"]["result"]
                results[name] = data[0]["value"][1] if data else None
            return results

    def get_metrics(self):
        registry = CollectorRegistry()
        multiprocess.MultiProcessCollector(registry)
        return generate_latest(registry)

    async def get_metrics_stream(self):
        while True:
            data = await self._fetch_all_metrics()
            yield f"{json.dumps(data)}\n\n"
            await asyncio.sleep(5)
