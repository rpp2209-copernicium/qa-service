# pull the Node image from Docker
FROM node:alpine

# set the current working directory
WORKDIR /api

# copy package.json
COPY package*.json .
COPY .env .

# install deps
RUN npm i

# copy the db data to the container
COPY ./api .

# start the server and listen for any changes
CMD ["npm", "start"]

# run the tests
# => YOU HAVE TO WAIT FOR THE DB TO POPULATE BEFORE RUNNING THESE
# CMD ["npm", "test"]



