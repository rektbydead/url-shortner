#!/bin/sh
set -e

echo ">> init-data.sh >> Deleting existing data"
rm -rf /var/lib/postgresql/data/*

echo ">> init-data.sh >> Taking base backup from primary "

pg_basebackup \
      -h postgres-primary \
      -D "/var/lib/postgresql/data/" \
      -U replicator \
      -Fp \
      -Xs \
      -P \
      -R

echo ">> init-data.sh >> Overwriting  "
cp /etc/replica/postgresql.conf /var/lib/postgresql/data/postgresql.conf

exec postgres -c config_file=/etc/postgresql/postgresql.conf