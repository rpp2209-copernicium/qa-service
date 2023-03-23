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

// GET REQUESTS
let fetch = async (endpoint, cb) => {
	const client = await pgPool.connect();
	let table, question_id, product_id, count, page, match;

	// Check the endpoint and do some variable setting based on its value
	const answerRegex = /^questions\/(\d+)\/(answers)(?:\?count=(\d+))?(?:&page=(\d+))?/i;
	const urlRegex = /^(questions)(?:\/\?product_id=(\d+))?(?:&count=(\d+))?(?:&page=(\d+))?/i;

	if (endpoint.match(answerRegex)) { // If request was made for answers, set Answer variables
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
	console.log('REGEX Matched: ', match);
	console.log('Extracted-- table is: ', table, '\nquestion_id or pid?', question_id, product_id, '\npage', page, 'count', count);

	// =============================================
	//           Build up the Queries...
	// =============================================
	// page testing

	// ANSWERS QUERY STRING
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
	// json_object_keys('{ "page" : ${page || 1} }') page, ${page || 1},
	const qIDQuery = `
		SELECT results.product_id,

		to_json(${page || 1}) page,
		to_json(${count || 5}) count,

		JSON_AGG(results) results FROM (

			SELECT DISTINCT on (questions.question_id) questions.question_id, questions.product_id, questions.question_body, questions.question_date, questions.asker_name, questions.question_helpfulness, questions.reported,
			json_build_object(
				"answer_id",

				json_build_object(
					'id', answer_id,
					'body', answer_body,
					'date', answer_date,
					'answerer_name', answerer_name,
					'helpfulness', answer_helpfulness,
					'photos', json_build_array('test_value.png', 'value_the_second.png')
				)

			) answers FROM questions

			JOIN answers ON answers.question_id=questions.question_id
			GROUP BY questions.question_id, answers.answer_id
			ORDER BY questions.question_id DESC
		) results
		${ !product_id ? '' : `WHERE results.product_id='${product_id}'`}
		GROUP BY results.product_id
	`;

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
	const qString = ((table === 'answers') ?
		`${aQuery}`
		: `${ !product_id ? 'SELECT * FROM questions' : `${qIDQuery}`}`
	);

	const query = `${qString} LIMIT 15`;
	console.log('Final Query String was: ', query);

	// Finally, execute the query and send back the results
	try {
		const { rows } = await client.query(query);
		const result = (!product_id && table !== 'answers') ? rows : rows[0];
		cb(null, result);
	} catch (err) {
		cb(err);
	} finally {
		client.release(); // Release connection back to the pool
	}
};

// PUT REQUESTS
let update = (endpoint, cb) => {

	// todo
	try {
		console.log('in update / trying to update...');
		cb(null, 'temp update success string')
	} catch(err) {
		cb(err)
	}

};

// POSTS REQUESTS
let save = async (table, question, cb) => {
	const client = await pgPool.connect();
	const { product_id, question_body, question_date, asker_name, asker_email, question_helpfulness, reported } = question;

	const query = `INSERT INTO ${table}(
		product_id, question_body, question_date, asker_name, asker_email, question_helpfulness, reported
		values('${product_id}', '${question_body}', '${question_date}', '${asker_name}', '${asker_email}', ${question_helpfulness}, ${reported})
	`;

	try {
		const { rows } = await client.query(query);
		// console.log('INSERT Question Result', result);
		cb(null, rows);

	} catch (err) {
		cb(err);

	} finally {
		client.release(); // Release connection back to the pool
	}
};

// TEST INSERT WORKS
// const q = {
// 	product_id: '1',
// 	question_body: 'test',
// 	question_date: 1638855284662,
// 	asker_name: 'linda',
// 	asker_email: 'linda@linda.com',
// 	question_helpfulness: 0
// 	reported: false,
// };

// // ==============================olumn "test" does not exist at character 121
// save(q, (err, payload) => {
// 	if (err) {
// 		console.log('SAVE ERROR', err);
// 	} else {
// 		console.log('fucking worked. finally', payload);
// 	}
// });

module.exports = { fetch, save, update };