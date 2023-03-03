\connect qa;

BEGIN;

CREATE SCHEMA qa;

CREATE TABLE questions(
	id INT PRIMARY KEY NOT NULL,
	product VARCHAR(255) NOT NULL,
	body VARCHAR(255),
	created_at TIMESTAMP,
	asker_name VARCHAR(255) NOT NULL,
	reported BOOLEAN,
	helpful INT
);

INSERT INTO questions(
	id,
	product,
	body,
	asker_name,
	reported,
	helpful
) VALUES (
	1,
	1,
	'What is it made out of?',
	'bob',
	false,
	2
);

COMMIT;
