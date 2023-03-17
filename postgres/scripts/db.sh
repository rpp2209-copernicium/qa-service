#! /bin/bash

# ------ TAGS ------
# -d Run command in detached mode
# -it Interactive mode (?)
# -c Execute the following command

# `admin` cli argument is the username for the database

# populate the questions database table
psql -d qa -U admin -c "\copy questions(
	id,
	product_id,
	body,
	date_written,
	asker_name,
	asker_email,
	reported,
	helpful
) FROM 'questions.csv' DELIMITER ',' CSV HEADER;"

# Populate the Answers database table
psql -d qa -U admin -c "\COPY answers(
	id,
	question_id,
	body,
	date_written,
	answerer_name,
	answerer_email,
	reported,
	helpful
) FROM 'answers.csv' DELIMITER ',' CSV HEADER;"

# Populate the Answers Photos database table
psql -d qa -U admin -c "\COPY answers_photos(
	id,
	answer_id,
	url
) FROM 'answers_photos.csv' DELIMITER ',' CSV HEADER;"