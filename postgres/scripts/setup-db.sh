#! /bin/bash

POSTGRES_USER=admin
POSTGRES_PASSWORD=sdc
POSTGRES_DB=qa

set -e

# Populate the questions, answers, and answers_photos database tables

# `admin` cli argument is the username for the database
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
	\c qa;
	\dt;
	\copy questions( id, product_id, body, date_written, asker_name, asker_email, reported, helpful) FROM '/usr/tmp/data/questions.csv' DELIMITER ',' CSV HEADER;
	\copy answers( id, question_id, body, date_written, answerer_name, answerer_email, reported, helpful) FROM 'answers.csv' DELIMITER ',' CSV HEADER;
	\copy answers_photos( id, answer_id, url) FROM 'answers_photos.csv' DELIMITER ',' CSV HEADER;
EOSQL