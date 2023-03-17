const express = require('express');
const router = express.Router();
const axios = require('axios');

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
//                QA Routes
// =============================================


// List Questions
// GET /qa/questions

// Parameters: product_id (int), page (int), count (int)
// Expected Response: Status: 200 OK
router.get('/questions', (req, res) => {
	res.send('GOT questions');
});

// Answers List
// GET /qa/questions/:question_id/answers

// Parameters: question_id
// Query Parameters: page, count
// Expected Response: Status: 200 OK
router.get('/questions/:question_id/answers', (req, res) => {

	res.send('GOT Answers for Question #' + req.params.question_id);
});

// Add a Question
// POST /qa/questions

// Body Parameters: body, name, email, product_id
// Expected Response: Status: 201 CREATED
router.post('/questions', (req, res) => {
	res.send('POSTed questions');
});

// Add an Answer
// POST /qa/questions/:question_id/answers

// Parameters: question_id
// Body Parameters: body, name, email, photos
// Expected Response: Status: 201 CREATED
router.post('/questions/:question_id/answers', (req, res) => {
	res.send('POSTED answers for Question #' + req.params.question_id);
});

// Mark Question as Helpful
// PUT /qa/questions/:question_id/helpful

// Parameters: question_id
// Expected Response: Status: 204 NO CONTENT
router.put(' /questions/:question_id/helpful', (req, res) => {
	res.send('Question #' + req.params.question_id + ' was Helpful');
});

// Report Question
// PUT /qa/questions/:question_id/report

// Parameters: question_id
// Expected Response: Status: 204 NO CONTENT
router.put('/questions/:question_id/report', (req, res) => {
	res.send('Reported Question #' + req.params.question_id);
});

// Mark Answer as Helpful
// PUT /qa/answers/:answer_id/helpful

// Parameters: answer_id
// Expected Response: Status: 204 NO CONTENT
router.put('/qa/answers/:answer_id/helpful', (req, res) => {
	res.send('Answer #' + req.params.question_id + 'was helpful');
});

// Report Answer
// PUT /qa/answers/:answer_id/report

// Parameters: answer_id
// Expected Response: Status: 204 NO CONTENT
router.put('/answers/:answer_id/report', (req, res) => {
	res.send('Reported Answer #' + req.params.answer_id);
});

module.exports = router;