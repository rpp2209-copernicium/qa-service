\connect qa;

BEGIN;

CREATE SCHEMA qa;

-- ----------------------
-- QUESTIONS TABLE
-- ----------------------
CREATE TABLE questions(
	question_id SERIAL PRIMARY KEY,
	product_id VARCHAR(255) NOT NULL,
	question_body VARCHAR(255),
	question_date BIGSERIAL,
	asker_name VARCHAR(255) NOT NULL,
	asker_email VARCHAR(255) NOT NULL,
	question_helpfulness INT,
	reported BOOLEAN
);

SAVEPOINT q_db_created;

CREATE INDEX product_id_index ON questions (product_id);

SAVEPOINT pid_index_created;

-- ----------------------
-- ANSWERS TABLE
-- ----------------------
CREATE TABLE answers(
	answer_id SERIAL PRIMARY KEY,
	answer_body VARCHAR(255),
	answer_date BIGSERIAL,
	answerer_name VARCHAR(255) NOT NULL,
	answerer_email VARCHAR(255),
	answer_helpfulness INT,
	reported BOOLEAN,
	question_id SERIAL NOT NULL,
	CONSTRAINT FK_question_id FOREIGN KEY (question_id) REFERENCES questions
);

SAVEPOINT a_db_created;

CREATE INDEX question_id_index ON answers (question_id);

SAVEPOINT qid_index_created;

-- ----------------------
-- PHOTOS TABLE
-- ----------------------
CREATE TABLE answers_photos(
	id SERIAL PRIMARY KEY,
	url VARCHAR(255),
	answer_id SERIAL NOT NULL,
	CONSTRAINT FK_answer_id FOREIGN KEY (answer_id) REFERENCES answers
);

SAVEPOINT p_db_created;

CREATE INDEX answer_id_index ON answers_photos (answer_id);

SAVEPOINT aid_index_created;

COMMIT;