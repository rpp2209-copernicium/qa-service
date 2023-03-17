# qa-service
Atelier Q&amp;A Service 

To start container: `docker-compose up -d --build`

To enter the container: `docker exec -it <container-id> /bin/sh`

Once inside either Node Container (app or api), you can run the test suites with: `npm run test`

Once inside the Postgres container, you can access the database using `psql -d qa -U admin`, followed by `\c qa`, and any psql queries you'd like to conduct.
