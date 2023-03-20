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

let update = () => {
	console.log('updating record in the database...todo');
};

let save = async (cb) => {
	const client = await pgPool.connect();

	// const { product_id, body, date_written, asker_name, asker_email, reported, helpful } = question;
	const query = `INSERT INTO questions(product_id, body, date_written, asker_name, asker_email, reported, helpful) values('1', 'another test body', 1638855284662, 'fuck', 'FUCK', false, 0);`;
	// const query = `INSERT INTO questions(product_id, body, date_written, asker_name, asker_email, reported, helpful) values(${product_id}, ${body}, ${date_written}, ${asker_name}, ${asker_email}, ${reported}, ${helpful});`;
	// console.log('Q STRING', query);

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

// ==============================
save((err, payload) => {
	if (err) {
		console.log('SAVE ERROR', err);
	} else {
		console.log('fucking worked. finally', payload);
	}
});

module.exports = { fetch, save, update };