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

	const query = `
		SELECT *
		FROM ${table || 'questions'}
		${ table === 'answers' ? `WHERE question_id=${id}` : '' }
		LIMIT 5
	`;

	try {
		const { rows } = await client.query(query);
		cb(null, rows);
	} catch (err) {
		cb(err);
	} finally {
		client.release(); // Release connection back to the pool
	}
};

let save = async (question, cb) => {
	const client = await pgPool.connect();
	// console.log('saving to database...todo', question.body, 'valid time?', Date.now());

	// const { body, name, email, product_id } = question;
	const query = `INSERT INTO questions(product_id, body, date_written, asker_name, asker_email, reported, helpful) values(${question.product_id}, ${question.body}, ${Date.now()}, ${question.name}, ${question.email}, false, 0)`;
	console.log('Q STRING', query);

	try {
		const result = await client.query(query);
		console.log('INSERT Question Result', result);
		cb(null, result);

	} catch (err) {
		cb(err);

	} finally {
		client.release(); // Release connection back to the pool
	}
};

const q = {
	body: 'This is a test body',
	name: 'Sandra O.R. Something',
	email: 'sandra@email.com',
	product_id: '1'
}

save(q,

	(err, payload) => {
		if (err) {
			console.log('Save a Question Error:', err)
			// res.status(500).json(err);
		} else {
			// Expected Response: Status: 201 CREATED
			console.log('Saved new QUESTION! ', payload);
			// res.status(201).send('CREATED');
		}
	}

);

let update = () => {
	console.log('updating record in the database...todo');
};

module.exports = { fetch, save, update };