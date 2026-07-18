#!/bin/sh
set -e

start_postgres() {
  echo ">> init-data.sh >> Starting PostgreSQL"
  postgres -D "$PGDATA" -c config_file=/etc/postgresql/postgresql.conf > "$LOG" 2>&1 &
  PG_PID=$!
}


basebackup() {
  echo ">> init-data.sh >> Taking base backup from primary "

  rm -rf "${PGDATA:?}"/*

  pg_basebackup \
      -h postgres-primary \
      -D "$PGDATA" \
      -U replicator \
      -Fp \
      -Xs \
      -P \
      -R

  echo ">> init-data.sh >> Overwriting postgresql.conf "
  cp /etc/postgresql/postgresql.conf "$PGDATA/postgresql.conf"
}


# First time initializing the application
if [ ! -s "$PGDATA/PG_VERSION" ]; then
  basebackup
else
  echo ">> init-data.sh >> Existing PostgreSQL data found. Skipping pg_basebackup."
  cp /etc/postgresql/postgresql.conf "$PGDATA/postgresql.conf"
fi

LOG=$(mktemp)

start_postgres

while kill -0 "$PG_PID" 2>/dev/null; do
    if grep -Eq "requested WAL segment .* has already been removed|could not receive data from WAL stream" "$LOG";
    then
        pg_ctl -D "$PGDATA" stop -m immediate || true
        wait "$PG_PID" || true

        basebackup
        exec "$0"
    fi

    sleep 1
done