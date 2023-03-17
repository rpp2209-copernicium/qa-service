\connect qa;

BEGIN;

CREATE SCHEMA qa;

-- ----------------------
-- QUESTIONS TABLE
-- ----------------------
CREATE TABLE questions(
	id INT PRIMARY KEY NOT NULL,
	product_id VARCHAR(255) NOT NULL,
	body VARCHAR(255),
	date_written BIGSERIAL,
	asker_name VARCHAR(255) NOT NULL,
	asker_email VARCHAR(255) NOT NULL,
	reported BOOLEAN,
	helpful INT
);

SAVEPOINT q_db_created;

-- ----------------------
-- ANSWERS TABLE
-- ----------------------
CREATE TABLE answers(
	id INT PRIMARY KEY NOT NULL,
	question_id INT REFERENCES questions NOT NULL,
	body VARCHAR(255),
	date_written BIGSERIAL,
	answerer_name VARCHAR(255) NOT NULL,
	answerer_email VARCHAR(255),
	reported BOOLEAN,
	helpful INT
);

SAVEPOINT a_db_created;

-- ----------------------
-- PHOTOS TABLE
-- ----------------------
CREATE TABLE answers_photos(
	id INT PRIMARY KEY NOT NULL,
	answer_id INT REFERENCES answers NOT NULL,
	url VARCHAR(255)
);

SAVEPOINT p_db_created;

COMMIT;