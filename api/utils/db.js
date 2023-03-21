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

// todo:
// convert this from jest syntax (?)
// afterAll(async () => {
//   await pgPool.end();
// });

let fetch = async (endpoint, cb) => {
	const client = await pgPool.connect();
	let id, table;

	// Check if the endpoint is /question_id/answers
	// and do some variable setting if so
	const regex = /^\d+\/answers$/;

	if (endpoint.match(regex)) {
		console.log('Match found', endpoint.match(regex));
		id = endpoint.split('/')[0];
		table = endpoint.split('/')[1];
		console.log('Splitting on backslash-- id is:', id, 'table name is: ', table);
	}

	// const qString = ((table === 'answers') ?
	// 	'SELECT answer_id, question_id, answer_body, answer_date, answerer_name, answerer_email, answer_helpfulness, reported'
	// 	: 'SELECT questions.question_id, questions.question_body, questions.question_date, questions.asker_name, questions.question_helpfulness, questions.reported'
	// );

	// const query = `
	// 	${qString}
	// 	FROM ${table || 'questions'}
	// 	${ table === 'answers' ? `WHERE questions.question_id=${id}` : 'INNER JOIN answers ON questions.question_id = answers.question_id' }
	// 	LIMIT 5
	// `;

	const query = `
		SELECT answer_id,

		json_build_object(
			"answer_id", row_to_json(answers)
		) answers FROM answers

		LIMIT 5
	`;

	// const query = `
	// 	SELECT questions.question_id, questions.product_id, questions.question_body, questions.question_date, questions.asker_name, questions.question_helpfulness, questions.reported,
	// 	json_build_object(
	// 		'answers', (SELECT json_agg(row_to_json(answers)) FROM "questions")
	// 	)
	// 	GROUP BY answers.question_id, questions.question_id
	// 	LIMIT 5
	// `;

	try {
		const { rows } = await client.query(query);
		cb(null, rows);
	} catch (err) {
		cb(err);
	} finally {
		client.release(); // Release connection back to the pool
	}
};

let update = () => {
	console.log('updating record in the database...todo');
};

let save = async (table, question, cb) => {
	const client = await pgPool.connect();
	const { product_id, question_body, question_date, asker_name, asker_email, question_helpfulness, reported } = question;

	// Hard-coded Test Query String
	// const query = `INSERT INTO questions(product_id, body, date_written, asker_name, asker_email, reported, helpful) values('1', 'another test body', 1638855284662, 'fuck', 'FUCK', false, 0);`;

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
// 	body: 'test',
// 	date_written: 1638855284662,
// 	asker_name: 'linda',
// 	asker_email: 'linda@linda.com',
// 	reported: false,
// 	helpful: 0
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