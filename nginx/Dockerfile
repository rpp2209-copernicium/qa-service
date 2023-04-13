# pull the Nginx image from Docker
FROM nginx:latest

# remove the default config file
RUN rm /etc/nginx/conf.d/default.conf

# copy the config file to the container
COPY nginx.conf /etc/nginx/conf.d/default.conf
