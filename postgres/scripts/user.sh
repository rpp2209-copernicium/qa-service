#! /bin/bash

set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
	CREATE USER admin;
	CREATE DATABASE qa;
	GRANT ALL PRIVILEGES ON DATABASE qa TO admin;
EOSQL
