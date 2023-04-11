# pull the Node image from Docker
FROM node:alpine

#ENV NEW_RELIC_NO_CONFIG_FILE=true

# Install K6
<<<<<<< HEAD
#WORKDIR /tmp
#ADD https://github.com/loadimpact/k6/releases/download/v0.27.1/k6-v0.27.1-linux64.tar.gz /tmp/k6-v0.27.1-linux64.tar.gz #RUN tar -xzf k6-v0.27.1-linux64.tar.gz
#RUN mv k6-v0.27.1-linux64/k6 /usr/bin/k6
=======
# WORKDIR /tmp
# ADD https://github.com/loadimpact/k6/releases/download/v0.27.1/k6-v0.27.1-linux64.tar.gz /tmp/k6-v0.27.1-linux64.tar.gz
# RUN tar -xzf k6-v0.27.1-linux64.tar.gz
# RUN mv k6-v0.27.1-linux64/k6 /usr/bin/k6
>>>>>>> f0fffe3cb074b0a3aeaf986bc6d960b8a299afe0

# set the current working directory
WORKDIR /api

# copy package.json
COPY package*.json .
COPY .env .

# install deps
RUN npm i

# copy the db data to the container
COPY ./api .

# ports are already mapped in compose YAML file
EXPOSE 8080

# start the server and listen for any changes
CMD ["npm", "start"]

# run the tests
# => YOU HAVE TO WAIT FOR THE DB TO POPULATE BEFORE RUNNING THESE
# CMD ["npm", "test"]



