# pull the PostgreSQL image from Docker
FROM postgres:latest

# create database + tables
ADD schema.sql /docker-entrypoint-initdb.d

# copy the db data to the container
COPY ./data/csv /var/lib/postgresql/data/

WORKDIR /var/lib/postgresql/data

# install node and npm
# RUN apt-get update && apt-get install -y \
#     software-properties-common \
# 		nodejs \
#     npm

# install node packages
# RUN npm i pg pg-copy-streams stream

# run load db script
# RUN node ./etl/questions-etl.js