FROM docker.io/python:3.14-slim

WORKDIR /app/

RUN apt-get update && apt-get install -y build-essential && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

COPY pyproject.toml .

RUN pip install --no-cache-dir --upgrade pip
RUN pip install --no-cache-dir .[deployment]

COPY src .

EXPOSE 8000

CMD ["gunicorn", "--workers", "4", "--worker-class", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8000", "main:app"]