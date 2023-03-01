# pull the NodeJS image from Docker
FROM node:alpine

# copy package.json
COPY package*.json ./

# install npm packages
RUN npm i

# copy the generated modules and all other files to the container
COPY . .

# app runs on port 3000, so we need to expose it
EXPOSE 3000

# make the default image command `npm run start`
CMD ["npm", "start"]