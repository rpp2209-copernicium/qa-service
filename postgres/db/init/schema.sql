\connect qa;

BEGIN;

CREATE SCHEMA qa;

-- ----------------------
-- QUESTIONS TABLE
-- ----------------------
CREATE TABLE questions(
	question_id SERIAL PRIMARY KEY NOT NULL,
	product_id VARCHAR(255) NOT NULL,
	question_body VARCHAR(255),
	question_date BIGSERIAL,
	asker_name VARCHAR(255) NOT NULL,
	asker_email VARCHAR(255) NOT NULL,
	reported BOOLEAN,
	question_helpfulness INT
);

SAVEPOINT q_db_created;

-- ----------------------
-- ANSWERS TABLE
-- ----------------------
CREATE TABLE answers(
	answer_id SERIAL PRIMARY KEY NOT NULL,
	question_id INT REFERENCES questions NOT NULL,
	answer_body VARCHAR(255),
	answer_date BIGSERIAL,
	answerer_name VARCHAR(255) NOT NULL,
	answerer_email VARCHAR(255),
	answer_helpfulness INT,
	reported BOOLEAN
);

SAVEPOINT a_db_created;

-- ----------------------
-- PHOTOS TABLE
-- ----------------------
CREATE TABLE answers_photos(
	id SERIAL PRIMARY KEY NOT NULL,
	answer_id INT REFERENCES answers NOT NULL,
	url VARCHAR(255)
);

SAVEPOINT p_db_created;

COMMIT;