#! /bin/bash

POSTGRES_USER=admin
POSTGRES_PASSWORD=sdc
POSTGRES_DB=qa

set -e

# Populate the questions, answers, and answers_photos database tables
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
	\c qa; 	
	\dt;

	\copy questions(question_id, product_id, question_body, question_date, asker_name, asker_email, reported, question_helpfulness) FROM 'questions.csv' DELIMITER ',' CSV HEADER;

	\copy answers(answer_id, question_id, answer_body, answer_date, answerer_name, answerer_email, reported, answer_helpfulness) FROM 'answers.csv' DELIMITER ',' CSV HEADER;

	\copy answers_photos(id, answer_id, url) FROM 'answers_photos.csv' DELIMITER ',' CSV HEADER;
EOSQL

# set the `next` primary key value to the current record count + 1 so we can insert more rows
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
	\c qa;

	SELECT setval(pg_get_serial_sequence('questions', 'question_id'), (SELECT MAX(question_id) FROM questions)+1);
EOSQL
