# pull the Node image from Docker
FROM node:alpine

# copy package.json
COPY package*.json .
COPY .env .

# install deps
RUN npm i

# copy the db data and New Relic Config to the container
COPY ./api .

# ports are already mapped in compose YAML file
EXPOSE 8080

# Uncomment these when implementing the Load Balancer
EXPOSE 8081 
EXPOSE 8082

# start the server and listen for any changes
CMD ["npm", "start"]
