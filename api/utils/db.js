require("dotenv").config();
const { Pool } = require('pg');

// DB Connection Config
let DB_URL = process.env.DB_URL;
let DB_USER = process.env.DB_USER;
let DB_PASSWORD = process.env.DB_PASSWORD;
let DB_HOST = process.env.DB_HOST;
let DB_NAME = process.env.DB_NAME;

// Connection String Pattern
// schema://user:password@host:port/database
// let dbString = `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:5432/${DB_NAME}`;
let dbString = `postgres://admin:sdc@${DB_HOST}:5432/qa`;
let pool = new Pool({ connectionString: dbString });
pool.connect();

// =============================================
//            		GET REQUESTS
// =============================================
let fetch = async (endpoint, cb) => {
	console.log('Fetching ENDPOINT from DB: ', endpoint);
	let table, question_id, product_id, match;
	let count = 5; 
	let page = 1;

	// Check the endpoint and do some variable setting based on its value
	const answerRegex = /^questions\/(\d+)\/(answers)(?:\?count=(\d+))?(?:&page=(\d+))?/i;
	const urlRegex = /^(questions)(?:\?product_id=(\d+))?(?:&count=(\d+))?(?:&page=(\d+))?/i;

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

	// Confirm the Regex grabbed expected values
	// console.log('REGEX Matched: ', match);
	console.log('Database Table: ', table, 
	  '\nquestion_id or pid?', question_id, product_id, 
		'\npage', page, 
		'count', count
	);

	// Build up the Queries...
	const answers = `SELECT 
			a.answer_id answer_id,
			a.answer_body body,
			a.answer_date date,
			a.answerer_name answerer_name,
			a.answer_helpfulness helpfulness,
			a.reported,
			(SELECT JSON_AGG(
				json_build_object('id', ap.id, 'url', ap.url)
			) photos FROM (SELECT * FROM answers_photos WHERE answers_photos.answer_id=a.answer_id) ap)
			
		FROM (SELECT * FROM answers WHERE question_id=${question_id}) a
		${`LIMIT ${count} OFFSET ${count * (page - 1)}`} 
	`;

	// Before adding extra SELECT
	// const answersOld = `SELECT 
	// 		a.answer_id answer_id,
	// 		a.answer_body body,
	// 		a.answer_date date,
	// 		a.answerer_name answerer_name,
	// 		a.answer_helpfulness helpfulness,
	// 		a.reported,
	// 		(SELECT JSON_AGG(
	// 			json_build_object('id', ap.id, 'url', ap.url)
	// 		) photos FROM answers_photos ap WHERE ap.answer_id=a.answer_id)
			
	// 	FROM (SELECT * FROM answers WHERE question_id=${question_id}) a
	// 	${`LIMIT ${count} OFFSET ${count * (page - 1)}`} 
	// `;
	
	// Can i index on the order by clause?
	// Experiment with composing separate queries 
	// instead of building up data via aggregations in a single query string
	const questions = `SELECT 
			q.question_id question_id,
			q.question_body,
			q.question_date,
			q.asker_name,
			q.question_helpfulness,
			q.reported,
			
			(SELECT JSON_AGG(
				json_build_object(
					a.answer_id,

					json_build_object(
						'id', a.answer_id,
						'body', a.answer_body,
						'date', a.answer_date,
						'answerer_name', a.answerer_name,
						'helpfulness', a.answer_helpfulness,
						'photos', (SELECT JSON_AGG(ap.url) photos FROM (SELECT * FROM answers_photos WHERE answers_photos.answer_id=a.answer_id) ap)
					)

				) 
			) answers FROM (SELECT * FROM answers WHERE answers.question_id=q.question_id) a)	
		FROM (SELECT * FROM questions WHERE product_id='${product_id}') q
		ORDER BY q.question_id DESC
		${`LIMIT ${count} OFFSET ${count * (page - 1)}`} 
	`;
	
	// Before adding extra SELECT
	// const questionsOLD = `SELECT 
	// 		q.question_id question_id,
	// 		q.question_body,
	// 		q.question_date,
	// 		q.asker_name,
	// 		q.question_helpfulness,
	// 		q.reported,
			
	// 		(SELECT JSON_AGG(
	// 			json_build_object(
	// 				a.answer_id,

	// 				json_build_object(
	// 					'id', a.answer_id,
	// 					'body', a.answer_body,
	// 					'date', a.answer_date,
	// 					'answerer_name', a.answerer_name,
	// 					'helpfulness', a.answer_helpfulness,
	// 					'photos', (SELECT JSON_AGG(ap.url) photos FROM answers_photos ap WHERE ap.answer_id=a.answer_id)
	// 				)

	// 			) 
	// 		) answers FROM answers a WHERE a.question_id=q.question_id)	
	// 	FROM (SELECT * FROM questions WHERE product_id='${product_id}') q
	// 	ORDER BY q.question_id DESC
	// 	${`LIMIT ${count} OFFSET ${count * (page - 1)}`} 
	// `;

	// =============================================
	// ✨ FINAL/AGGREGATED Q STRINGS
	const query = (table === 'answers' ?
			`${answers}` // If table is answers then run the Answers query
			: `${ product_id ? 
			`${questions}` // ELSE run Questions query
			: `SELECT * FROM questions ${`LIMIT ${count} OFFSET ${count * (page - 1)}`}` // ELSE, just get the first 15 questions
		}`
	);

	// Finally, execute the query and send back the results
	try {
		console.log('QUERY STRING WAS:', query);
		const { rows } = await pool.query(query);
		// console.log('DB FETCH RESULT: ', rows);
		cb(null,  rows);
	} catch (err) {
		cb(err);
	}
};


// =============================================
//            		PUT REQUESTS
//				Mark Q or A Reported / Helpful
// =============================================
let update = async (endpoint, body, cb) => {

	// Set Update Column to 'reported' or 'helpfulness' 
	// dependent on which table was passed to the update function 
	let table = body.table || 'questions';
	console.log('TABLE IS: ', table);

	let col = (endpoint === 'helpful' && table === 'answers') 
		? "answer_helpfulness"
	  : (table === 'questions' && endpoint === 'helpful') ? "question_helpfulness"
		: "reported";

	// Get the current helpfulness value, so it can be incremented
	const { rows } = await pool.query(`
		SELECT ${col} 
		FROM ${table} 
		WHERE ${table === 'answers' ? 'answer_id' : 'question_id'}=${body.id}
	`);

	// Increment the current helpfulness
	const nextSum = rows[0][col] + 1;

	// If updating Q or A helpfulness
	// Set the current database helpfulness value to `nextSum`
	// Otherwise, set reported to `true` 
	const query = `
		UPDATE ${table} 
		SET ${col} = ${
			(col === 'question_helpfulness' || col === 'answer_helpfulness') 
			? `${nextSum}` 
			: true 
		} 
		WHERE ${table === 'answers' ? 'answer_id' : 'question_id'}=${body.id}
	`;

	try {
		// console.log('UPDATE Q String: ', query);
		// console.log('Sum BEFORE: ', nextSum - 1, 'After: ', nextSum);
		const { rows } = await pool.query(query);
		// console.log('DB PUT/UPDATE RESULT: ', rows);
		cb(null, rows);
	} catch (err) {
		cb(err);

	} 
};

// =============================================
//            		POST REQUESTS 
//			Submit a new Question or Answer
// =============================================
let save = async (table, qaObj, cb) => {
	// console.log('IN DB SAVE', qaObj);

	// Build the query string depending on which table was passed into the function
	const query = (table === 'questions') ? `
		INSERT INTO ${table}("product_id", "question_body", "question_date", "asker_name", "asker_email", "question_helpfulness", "reported")
		VALUES('${qaObj.product_id}', '${qaObj.question_body}', ${Date.now()}, '${qaObj.asker_name}', '${qaObj.asker_email}', 0, false)
	`
	: `
		INSERT INTO ${table}("answer_body", "answer_date", "answerer_name", "answerer_email", "answer_helpfulness", "reported", "question_id")
		VALUES('${qaObj.answer_body}', ${Date.now()}, '${qaObj.answerer_name}', '${qaObj.answerer_email}', 0, false, ${qaObj.question_id})
	`;

	try {
		// Perform the insert and send the results back to the client
		const { rows } = await pool.query(query);
		cb(null, rows);

	} catch (err) {
		cb(err);

	} 
};

module.exports = { fetch, save, update  };
