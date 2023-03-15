# pull the PostgreSQL image from Docker
FROM postgres:latest

# copy the config file to the container
RUN cat /usr/share/postgresql/postgresql.conf.sample > my-postgres.conf
RUN echo "listen_addresses = '*'" >> my-postgres.conf
RUN cat my-postgres.conf

# COPY postgresql.conf /usr/share/postgresql/postgresql.conf
# RUN vi postgresql.conf 1G i listen_addresses = '*' :wq

# create database + tables
ADD db/schema.sql /docker-entrypoint-initdb.d
# ADD scripts/user.sh /docker-entrypoint-initdb.d
ADD scripts/setup-db.sh /docker-entrypoint-initdb.d

# set the current working directory
WORKDIR /usr/tmp/data/

# copy the db data to the container
COPY ./data/csv .
# COPY scripts/db.sh .

# # ENTRYPOINT ["/usr/tmp/data/db.sh"]
# SHELL [ "/bin/bash", "-c"]
# CMD ["sh", "db.sh"]
