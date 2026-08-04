from enum import Enum


class K6ContainerStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    ENDED = "ended"