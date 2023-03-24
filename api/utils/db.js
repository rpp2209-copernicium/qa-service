require("dotenv").config();
const { Pool } = require('pg');

// DB Connection Config
let DB_USER = process.env.DB_USER;
let DB_PASSWORD = process.env.DB_PASSWORD;
let DB_HOST = process.env.DB_HOST;
let DB_NAME = process.env.DB_NAME;

// Connection String Pattern
// schema://user:password@host:port/database
let dbString = `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:5432/${DB_NAME}`;

// =============================================
//            Postgres Pool Set Up
// =============================================
let pgPool = new Pool({ connectionString: dbString });

// GET REQUESTS (Get a Product's Questions, a Question's Answers, or an Answer's Photos)
let fetch = async (endpoint, cb) => {
	const client = await pgPool.connect();
	let table, question_id, product_id, count, page, match;

	// Check the endpoint and do some variable setting based on its value
	const answerRegex = /^questions\/(\d+)\/(answers)(?:\?count=(\d+))?(?:&page=(\d+))?/i;
	const urlRegex = /^(questions)(?:\/\?product_id=(\d+))?(?:&count=(\d+))?(?:&page=(\d+))?/i;

	// If request was made for answers, set Answer variables
	if (endpoint.match(answerRegex)) {
		match = endpoint.match(answerRegex);
		table = match[2];

		if (table === 'answers') {
			question_id = match[1];
			if (match[3]) {
				count = match[3];
				page = match[4];
			}
		}

	} else if (endpoint.match(urlRegex)) { // Else, if request was made for questions, set Question variables
		match = endpoint.match(urlRegex);
		table = match[1];
		product_id = match[2];
		if (match[3]) {
			count = match[3];
			page = match[4];
		}
	} else {
		match = 'no match'; // set error string if no match found
	}
	// Check Regex grabbed the right variable values
	// console.log('REGEX Matched: ', match);
	// console.log('Extracted-- table is: ', table, '\nquestion_id or pid?', question_id, product_id, '\npage', page, 'count', count);

	// =============================================
	//           Build up the Queries...
	// =============================================
	// ✅ ANSWERS QUERY STRING
	const aQuery = `
	SELECT answers.question_id,

		to_json(${page || 1}) page,
		to_json(${count || 5}) count,

		json_agg(
			json_build_object(
				'answer_id', answer_id,
				'body', answer_body,
				'date', answer_date,
				'answerer_name', answerer_name,
				'answer_helpfulness', answer_helpfulness,
				'question_id', question_id,
				'photos', json_build_array('test_value.png', 'value_the_second.png')
			)
		) results FROM answers
		${ !question_id ? '' : `
			WHERE answers.question_id=${question_id}
			GROUP BY answers.question_id
		`}
	`;

	// ✅ QUESTIONS QUERY STRING
	const qIDQuery = `
		SELECT DISTINCT on (questions.question_id) questions.question_id, questions.question_body, questions.question_date, questions.asker_name, questions.question_helpfulness, questions.reported,

		json_build_object(
			"id",

			json_build_object(
				'id', answers.answer_id,
				'body', answer_body,
				'date', answer_date,
				'answerer_name', answerer_name,
				'helpfulness', answer_helpfulness,
				'photos', JSON_AGG(answers_photos.url)
			)

		) answers FROM questions

		JOIN answers ON answers.question_id=questions.question_id
		JOIN answers_photos ON answers_photos.answer_id=answers.answer_id
		${ !product_id ? '' : `WHERE questions.product_id='${product_id}'`}
		GROUP BY questions.question_id, answers.answer_id, answers_photos.id
		ORDER BY questions.question_id DESC
	`;


	const test = `
		SELECT r.product_id,

		json_agg (r) results FROM (

			SELECT DISTINCT on (questions.question_id) questions.question_id,
				questions.product_id,
				questions.question_body,
				questions.question_date,
				questions.asker_name,
				questions.question_helpfulness,
				questions.reported,

				json_build_object(
					"answer_id",
					json_build_object(
						'id', answer_id,
						'body', answer_body,
						'date', answer_date,
						'answerer_name', answerer_name
					)
				) answers FROM questions

				JOIN answers ON answers.question_id=questions.question_id
				GROUP BY questions.question_id, answers.answer_id
				ORDER BY questions.question_id DESC

		) r
		WHERE r.product_id='6'
		GROUP BY r.product_id;
	`;

	// ❌ PHOTOS QUERY STRING (TODO)
	// const photosQuery = `
	// 	SELECT answers.answer_id, JSON_AGG(
	// 		json_build_object(
	// 			'url', url,
	// 			'answer_id', answers.answer_id
	// 		)
	// 	) photos FROM answers

	// 	JOIN answers_photos ON answers_photos.answer_id=answers.answer_id
	// 	GROUP BY answers.answer_id

	// 	LIMIT 10
	// `;

	// =============================================
	//          FINAL/AGGREGATED Q STRINGS
	// =============================================
	// If table is answers, run Answers query, else run Questions query
	const query = (table === 'answers' ?
		`${aQuery}`
		: `${ !product_id ? 'SELECT * FROM questions LIMIT 15' : `${qIDQuery}`}`
	);

	// Finally, execute the query and send back the results
	try {
		// console.log('GET EP Query String was: ', query);
		const { rows } = await client.query(query);
		const result = (table === 'answers') ? rows[0] : rows;
		cb(null, result);
	} catch (err) {
		cb(err);
	} finally {
		client.release(); // Release connection back to the pool
	}
};

// PUT REQUESTS (Report a Question/Answer or mark it Helpful)
let update = async (endpoint, payload, cb) => {
	const client = await pgPool.connect();

	let table = payload.table || 'questions';
	let col = endpoint === 'helpful' ? "question_helpfulness" : "reported";

	const { rows } = await client.query(`SELECT ${col} FROM ${table} WHERE question_id=${payload.id}`);
	const nextSum = rows[0].question_helpfulness + 1;
	const query = `UPDATE ${table} SET ${col} = ${col === 'question_helpfulness' ? `${nextSum}` : true } WHERE question_id=${payload.id}`;

	try {
		// console.log('UPDATE Q String: ', query);
		// console.log('Sum BEFORE: ', nextSum - 1, 'After: ', nextSum);
		const { rows } = await client.query(query);
		cb(null, rows);
	} catch (err) {
		cb(err);

	} finally {
		client.release(); // Release connection back to the pool
	}

};

// POSTS REQUESTS (submit a new Question or Answer)
let save = async (table, question, cb) => {
	const client = await pgPool.connect();
	const { product_id, question_body, asker_name, asker_email } = question;

	const query = `
		INSERT INTO ${table}("product_id", "question_body", "question_date", "asker_name", "asker_email", "question_helpfulness", "reported")
		VALUES('${product_id}', '${question_body}', ${Date.now()}, '${asker_name}', '${asker_email}', 0, false)
	`;

	try {
		// console.log('INSERT Question Q String', query);
		const { rows } = await client.query(query);
		cb(null, rows);

	} catch (err) {
		cb(err);

	} finally {
		client.release(); // Release connection back to the pool
	}
};

// FETCH DB ROW COUNT
let fetchRowCount = async (table, cb) => {
	const client = await pgPool.connect();
	const query = `SELECT COUNT(*) FROM ${table || 'questions'}`;

	try {
		// console.log('Fetch ROW COUNT Query String: ', query);
		const { rows } = await client.query(query);
		console.log('ROW COUNT RESULT', rows);
		cb(null, rows);

	} catch (err) {
		cb(err);

	} finally {
		client.release(); // Release connection back to the pool
	}
};

module.exports = { fetch, save, update, fetchRowCount };
