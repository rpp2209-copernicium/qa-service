#! /bin/bash

# ------ TAGS ------
# -d Run command in detached mode
# -it Interactive mode (?)
# -c Execute the following command

POSTGRES_USER=admin
POSTGRES_PASSWORD=sdc
POSTGRES_DB=qa
# `admin` cli argument is the username for the database

set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
	\c qa;
	\dt;
EOSQL

# populate the questions database table
# psql  -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
# 	COPY questions(
# 		id,
# 		product_id,
# 		body,
# 		date_written,
# 		asker_name,
# 		asker_email,
# 		reported,
# 		helpful
# 	) FROM 'questions.csv' DELIMITER ',' CSV HEADER;
# EOSQL

# Populate the Answers database table
# psql --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" -c "\COPY answers(
# 	id,
# 	question_id,
# 	body,
# 	date_written,
# 	answerer_name,
# 	answerer_email,
# 	reported,
# 	helpful
# ) FROM 'answers.csv' DELIMITER ',' CSV HEADER;"

# # Populate the Answers Photos database table
# psql --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" -c "\COPY answers_photos(
# 	id,
# 	answer_id,
# 	url
# ) FROM 'answers_photos.csv' DELIMITER ',' CSV HEADER;"