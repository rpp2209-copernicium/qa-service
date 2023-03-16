const express = require('express');
const router = express.Router();
const axios = require('axios');

// List Questions
// GET /qa/questions
// Parameters: product_id (int), page (int), count (int)
// Expected Response: Status: 200 OK
router.get('/qa/questions', (req, res) => {

});

// Answers List
// GET /qa/questions/:question_id/answers
// Parameters: question_id
// Query Parameters: page, count
// Expected Response: Status: 200 OK
router.get('/qa/questions/:question_id/answers', (req, res) => {

});
// Add a Question
// POST /qa/questions
// Body Parameters: body, name, email, product_id
// Expected Response: Status: 201 CREATED
router.post('/qa/questions', (req, res) => {

});

// Add an Answer
// POST /qa/questions/:question_id/answers
// Parameters: question_id
// Body Parameters: body, name, email, photos
// Expected Response: Status: 201 CREATED
router.post('/qa/questions/:question_id/answers', (req, res) => {

});

// Mark Question as Helpful
// PUT /qa/questions/:question_id/helpful
// Parameters: question_id
// Expected Response: Status: 204 NO CONTENT
router.put(' /qa/questions/:question_id/helpful', (req, res) => {

});

// Report Question
// PUT /qa/questions/:question_id/report
// Parameters: question_id
// Expected Response: Status: 204 NO CONTENT
router.put('/qa/questions/:question_id/report', (req, res) => {

});

// Mark Answer as Helpful
// PUT /qa/answers/:answer_id/helpful
// Parameters: answer_id
// Expected Response: Status: 204 NO CONTENT
router.put('/qa/answers/:answer_id/helpful', (req, res) => {

});

// Report Answer
// PUT /qa/answers/:answer_id/report
// Parameters: answer_id
// Expected Response: Status: 204 NO CONTENT
router.put('/qa/answers/:answer_id/report', (req, res) => {

});
