# pull the PostgreSQL image from Docker
FROM postgres:latest

# copy the db data to the container
COPY ./data/ndjson ./etc/data

# set required ENV variables
# ENV POSTGRES_PASSWORD=sdc