require("dotenv").config();
const { Pool } = require('pg');

// DB Connection Config
let DB_USER = process.env.DB_USER;
let DB_PASSWORD = process.env.DB_PASSWORD;
let DB_HOST = process.env.DB_HOST;
let DB_NAME = process.env.DB_NAME;

// Connection String Pattern
// schema://user:password@host:port/database
// let dbString = `postgres://admin:sdc@postgres:5432/qa`;
let dbString = `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:5432/${DB_NAME}`;

// =============================================
//                TEST SET UP
// =============================================
let pgPool;

beforeAll(() => {
  pgPool = new Pool({
    connectionString: dbString
  })
});

afterAll(async () => {
  await pgPool.end();
});


describe('Containerized QA Database', function() {

  it('should query the db successfully', async () => {
    const client = await pgPool.connect();

    try {

      // Start Transaction
      await client.query('BEGIN');

      // Query the database for some arbitrary information
      const { rows } = await client.query('SELECT count(*) FROM questions AS "result"')

      // Confirm the database returned a valid/expected response
      expect(parseInt(rows[0].count)).toBe(3518963);

      // Revert to the last save point
      await client.query('ROLLBACK');

    } catch (err) {
      throw err;
    } finally {
      // Release connection back to the pool
      client.release();
    }

  });

  it('should return the record count for each qa database table', async () => {
    const client = await pgPool.connect(); // Connect to the database
    const tableRecords = { // Expected row count for each db table
      "questions": 3518963,
      "answers": 6879306,
      "answers_photos": 2063759
    };

    try {
      await client.query('BEGIN'); // Start Transaction

      Object.keys(tableRecords).forEach(async table => { // Query each table in the db
        const { rows } = await client.query(`
          SELECT count(*)
          FROM ${table}
          AS "result"
        `)
        expect(parseInt(rows[0].count)).toBe(tableRecords[table]); // Check the row count is what we expect it to be
      });

      await client.query('ROLLBACK'); // Revert to the last save point
    } catch (err) { // Handle any errors
      // console.log('QUERY Err', err);
      throw err;
    } finally { // Release connection back to the pool
      client.release();
    }
  });

});

describe('Query Response Time', function() {

  it('should query the db and return in < 50ms', async () => {
    const client = await pgPool.connect();

    try {
      await client.query('BEGIN'); // Start Transaction

      // Query the database for some arbitrary information
      const { rows } = await client.query('EXPLAIN ANALYZE SELECT * FROM questions AS "result"')

      const regex = /\b\d+.\d+\b/; // regex to extract ms int from QUERY result
      const executionTime = parseFloat(rows[2]['QUERY PLAN'].match(regex)[0]);

      // Confirm the database returned response in the required amount of time
      expect(executionTime).toBeLessThanOrEqual(50);

      await client.query('ROLLBACK'); // Revert to the last save point

    } catch (err) { // Handle any errors
      throw err;
    } finally { // Release connection back to the pool
      client.release();
    }
  });

});