require("dotenv").config();
const { Pool } = require('pg');

// DB Connection Config
let DB_URL = process.env.DB_URL;
let DB_USER = process.env.DB_USER;
let DB_PASSWORD = process.env.DB_PASSWORD;
let DB_HOST = process.env.DB_HOST;
let DB_NAME = process.env.DB_NAME;


// =============================================
//  IF ERRORS CONNECTING TO DATABASE FROM 
// DEPLOYED EC2 INSTANCE, RE-RUN PORT-MAPPING 
//   COMMAND ON !! BOTH !! CONTAINERS AGAIN

// sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port <desired_port>
// =============================================

// Connection String Pattern
// schema://user:password@host:port/database
// let dbString = `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:5432/${DB_NAME}`;

let dbString = `postgres://admin:sdc@${DB_HOST}:5432/qa`;
// let dbString = `postgres://admin:sdc@postgres:5432/qa`;

// =============================================
//            Postgres Pool Set Up
// =============================================
let pgPool = new Pool({ connectionString: dbString });

// GET REQUESTS (Get a Product's Questions, a Question's Answers, or an Answer's Photos)
let fetch = async (endpoint, cb) => {
	// console.log('Fetching ENDPOINT from DB: ', endpoint);
	const client = await pgPool.connect();
	let table, question_id, product_id, match;
	let count = 5; 
	let page = 1;

	// Check the endpoint and do some variable setting based on its value
	const answerRegex = /^\/questions\/(\d+)\/(answers)(?:\?count=(\d+))?(?:&page=(\d+))?/i;
	const urlRegex = /^(\/questions)(?:\?product_id=(\d+))?(?:&count=(\d+))?(?:&page=(\d+))?/i;

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
	SELECT json_agg(results) answers FROM (
		SELECT json_build_object(
			'answer_id', answers.answer_id,
			'body', answer_body,
			'date', answer_date,
			'answerer_name', answerer_name,
			'helpfulness', answer_helpfulness,
			'photos', JSON_AGG(json_build_object('id', answers_photos.id, 'url', answers_photos.url))
		) results FROM answers
		JOIN answers_photos ON answers_photos.answer_id=answers.answer_id
		WHERE question_id=${question_id}
		GROUP BY question_id, answers.answer_id, answers_photos.id
		${`LIMIT ${count} OFFSET ${count * (page - 1)}`}
	) results
	`;

  // TEMP - COMPARE SPEED BEFORE INDEXING / OPTIMIZING TO O.G. A QUERY ABOVE 
	// Query optimizations made: 
	// 1. Reduced the size of my data set by filtering answers by question ID 
		// **before building final JSON object. 
	// 2. Removed extraneous aggregate calculations (had an extra json_agg that wasn't necessary)
	
	// Potential future optimization: GROUP BY strictly necessary? Look into eliminating that condition
	const temp = `SELECT a.answer_id, 
		json_build_object(
			'answer_id', a.answer_id,
			'body', a.answer_body,
			'date', a.answer_date,
			'answerer_name', a.answerer_name,
			'helpfulness', a.answer_helpfulness,
			'photos', ( SELECT 
					JSON_AGG(
						json_build_object('id', ap.id, 'url', ap.url) 
						FROM answers_photos ap 
						WHERE ap.id = a.answer_id
					) 
				)				
		) results
	  FROM ( SELECT * FROM answers WHERE question_id=${question_id} ) a
		GROUP BY a.answer_id,
	  ${`LIMIT ${count} OFFSET ${count * (page - 1)}`} 
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
		${`LIMIT ${count} OFFSET ${count * (page - 1)}`}
	`;

	// =============================================
	//          FINAL/AGGREGATED Q STRINGS
	// =============================================
	// If table is answers, run Answers query, else run Questions query
	const query = (table === 'answers' ?
		`${aQuery}`
		: `${ !product_id ? `SELECT * FROM questions ${`LIMIT ${count} OFFSET ${count * (page - 1)}`}` : `${qIDQuery}`}`
	);

	const queryString = `SELECT * FROM questions
		LEFT JOIN answers on questions.question_id=answers.question_id
		LEFT JOIN answers_photos on answers.answer_id=answers_photos.answer_id
		WHERE questions.product_id='${product_id}'
		LIMIT ${count} OFFSET ${(page - 1) * count}
	`;
	
	// Finally, execute the query and send back the results
	try {
		console.log('QUERY STRING WAS:', query);
		const { rows } = await client.query(queryString);
		// const { rows } = await client.query(query);
		//console.log('QUERY STRING RESULT: ', rows);
		if (table === 'answers') {
			cb(null,  rows[0]);
		} else {
			cb(null,  rows);
		}
	} catch (err) {
		cb(err);
	}
};

// PUT REQUESTS (Report a Question/Answer or mark it Helpful)
let update = async (endpoint, body, cb) => {
	const client = await pgPool.connect();

	let table = body.table || 'questions';
	let col = (endpoint === 'helpful' && table === 'answers') ? "answer_helpfulness"
	  : (table === 'questions') ? "question_helpfulness"
		: "reported";

	const { rows } = await client.query(`SELECT ${col} FROM ${table} WHERE ${table === 'answers' ? 'answer_id' : 'question_id'}=${body.id}`);
	const nextSum = rows[0][col] + 1;
	const query = `UPDATE ${table} SET ${col} = ${(col === 'question_helpfulness' || col === 'answer_helpfulness') ? `${nextSum}` : true } WHERE ${table === 'answers' ? 'answer_id' : 'question_id'}=${body.id}`;

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
let save = async (table, qaObj, cb) => {
	const client = await pgPool.connect();
	if (table === 'answers') {
		const { answer_body, answerer_name, answerer_email, question_id } = qaObj;
	} else if (table === 'questions') {
		const { product_id, question_body, asker_name, asker_email } = qaObj;
	}

	const query = (table === 'questions') ? `
		INSERT INTO ${table}("product_id", "question_body", "question_date", "asker_name", "asker_email", "question_helpfulness", "reported")
		VALUES('${product_id}', '${question_body}', ${Date.now()}, '${asker_name}', '${asker_email}', 0, false)
	`
	: `
		INSERT INTO ${table}("answer_body", "answer_date",  "answerer_name", "asker_name", "answerer_email", "answer_helpfulness", "reported")
		VALUES('${answer_body}', ${Date.now()}, '${answerer_name}', '${answerer_email}', 0, false)
	`;

	try {
		// console.log('INSERT String', query);
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
