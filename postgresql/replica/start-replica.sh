#!/bin/sh
set -e

echo ">> init-data.sh >> Deleting existing data"
rm -rf "${PGDATA:?}"/*

echo ">> init-data.sh >> Taking base backup from primary "

pg_basebackup \
      -h postgres-primary \
      -D $PGDATA \
      -U replicator \
      -Fp \
      -Xs \
      -P \
      -R

echo ">> init-data.sh >> Overwriting postgresql.conf "
cp /etc/postgresql/postgresql.conf "$PGDATA/postgresql.conf"

exec postgres -D "$PGDATA" -c config_file=/etc/postgresql/postgresql.conf