\connect qa;

BEGIN;

COPY questions(
	id,
	product_id,
	body,
	date_written,
	asker_name,
	asker_email,
	reported,
	helpful
) FROM 'questions.csv' DELIMITER ',' CSV HEADER;

COMMIT;