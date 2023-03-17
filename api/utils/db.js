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

// todo: convert this from jest syntax (?)
// afterAll(async () => {
//   await pgPool.end();
// });

let dbFetch = async (cb) => {
	const client = await pgPool.connect();

	try {
		const { rows } = await client.query('SELECT count(*) FROM questions AS "result"');
		cb(null, parseInt(rows[0].count));
	} catch (err) {
		cb(err);
	} finally {
		client.release(); // Release connection back to the pool
	}
};

module.exports.dbFetch = dbFetch;