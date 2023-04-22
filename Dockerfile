# pull the Node image from Docker
FROM node:alpine

# Install K6
WORKDIR /tmp

ADD https://github.com/loadimpact/k6/releases/download/v0.31.0/k6-v0.31.0-linux64.tar.gz /tmp/k6-v0.31.0-linux64.tar.gz 

RUN tar -xzf k6-v0.31.0-linux64.tar.gz

RUN mv k6-v0.31.0-linux64/k6 /usr/bin/k6

# copy package.json
COPY package*.json .
COPY .env .

# install deps
RUN npm i

# copy the db data and New Relic Config to the container
COPY newrelic.js .
COPY ./api .

# ports are already mapped in compose YAML file
EXPOSE 8080

# Uncomment these when implementing the Load Balancer
# EXPOSE 8081 
# EXPOSE 8082

# start the server and listen for any changes
# CMD ["npm", "run", "nr"]
CMD ["npm", "start"]
