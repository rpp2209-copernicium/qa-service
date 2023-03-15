# pull the PostgreSQL image from Docker
FROM postgres:latest

# copy the config file to the container
RUN cat /usr/share/postgresql/postgresql.conf.sample > my-postgres.conf

# COPY postgresql.conf /usr/share/postgresql/postgresql.conf
# RUN vi postgresql.conf 1G i listen_addresses = '*' :wq

# create database + tables
ADD db/schema.sql /docker-entrypoint-initdb.d

# set the current working directory
WORKDIR /var/lib/postgresql/data

# copy the db data to the container
COPY ./data/csv ../tmp/data/
