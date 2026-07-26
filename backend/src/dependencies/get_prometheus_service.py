from services.prometheus_service import PrometheusService


def get_prometheus_service() -> PrometheusService:
    return PrometheusService()
