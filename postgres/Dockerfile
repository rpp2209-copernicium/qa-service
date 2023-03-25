# pull the PostgreSQL image from Docker
FROM postgres:15.2

# copy the config file to the container
RUN cat /usr/share/postgresql/postgresql.conf.sample > my-postgres.conf

# allow all containers to access the database
RUN echo "listen_addresses = '*'" >> my-postgres.conf
RUN echo "max_wal_size = '3072'" >> my-postgres.conf
RUN cat my-postgres.conf

# create database + tables
ADD db/init/schema.sql /docker-entrypoint-initdb.d
ADD scripts/setup-db.sh /docker-entrypoint-initdb.d

# set the current working directory
WORKDIR /usr/tmp/data/

# copy the db data to the container
COPY ./data/csv .