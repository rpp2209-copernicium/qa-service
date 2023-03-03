# pull the PostgreSQL image from Docker
FROM postgres:latest

# copy the db data to the container
COPY ./data/ndjson/ /var/lib/postgresql/data/

ADD schema.sql /docker-entrypoint-initdb.d