\connect qa;

BEGIN;

CREATE SCHEMA qa;

-- ----------------------
-- QUESTIONS TABLE
-- ----------------------
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

SAVEPOINT q_db_created;

-- ----------------------
-- ANSWERS TABLE
-- ----------------------
CREATE TABLE answers(
	id INT PRIMARY KEY NOT NULL,
	question INT REFERENCES questions NOT NULL,
	body VARCHAR(255),
	created_at TIMESTAMP,
	answerer_name VARCHAR(255) NOT NULL,
	reported BOOLEAN,
	helpful INT
);

INSERT INTO answers(
	id,
	question,
	body,
	answerer_name,
	reported,
	helpful
) VALUES (
	1,
	1,
	'100% Cotton',
	'billybob',
	false,
	5
);

SAVEPOINT a_db_created;

-- ----------------------
-- PHOTOS TABLE
-- ----------------------
CREATE TABLE answers_photos(
	id INT PRIMARY KEY NOT NULL,
	answer INT REFERENCES answers NOT NULL,
	url VARCHAR(255)
);

INSERT INTO answers_photos(id, answer, url) VALUES (1, 1, 'default.png');

SAVEPOINT p_db_created;

COMMIT;

-- ----------------------
-- INSERT REAL DATA
-- ----------------------
BEGIN;

COPY questions(
	id,
	product,
	body,
	created_at,
	asker_name,
	reported,
	helpful
)

FROM 'questions.csv'

DELIMITER ','

CSV HEADER

SAVEPOINT q_db_loaded;

-- SAVEPOINT a_db_loaded;

-- SAVEPOINT p_db_loaded;

COMMIT;