from prometheus_client import multiprocess


def process_exit(process):
    if process.pid is not None:
        multiprocess.mark_process_dead(process.pid)
