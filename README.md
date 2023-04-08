# qa-service
Atelier Q&amp;A Service 

**Docker Containers**:
- Postgres: runs on port 5432
- Client: runs on port 3000
- API: runs on port 8080

To start containers: `docker-compose up -d --build`

To enter the container: `docker exec -it <container-id> /bin/sh`

Once inside either Node Container (app or api), you can run the test suites with: `npm run test`

Once inside the Postgres container, you can access the database using `psql -d qa -U admin`, followed by `\c qa`, and any psql queries you'd like to conduct.
