const express = require('express');
const router = express.Router();
const axios = require('axios');

const { fetch, save, update } = require('../../utils/db.js');

// =============================================
//                Questions
// =============================================
// List Questions
// GET /qa/questions

// Parameters: product_id (int), page (int), count (int)
router.get('/questions', (req, res) => {
	fetch('questions', (err, payload) => {
		if (err) {
			console.log('FETCH Q\'s Error:', err);
			res.status(500).json(err);
		} else {
			// console.log('Q Data', payload);
			res.status(200).json(payload); // Expected Status: 200 OK
		}
	});
});

// Add a Question
// POST /qa/questions
router.post('/questions', (req, res) => {
	// Body Parameters: body, name, email, product_id
	const body = req.body;

	// send(body, (err, payload) => {
	// 	if (err) {
	// 		console.log('POST Question Error:', err)
	// 		res.status(500).json(err);
	// 	} else {
	// 		res.status(201).send('CREATED'); // Expected Status: 201 CREATED
	// 	}
	// });

});

// Mark Question as Helpful
// PUT /qa/questions/:question_id/helpful
router.put('/questions/:question_id/helpful', (req, res) => {
	// Parameters: question_id
	update();
	res.status(204).send('NO CONTENT'); // Expected Status: 204 NO CONTENT
});

// Report Question
// PUT /qa/questions/:question_id/report
router.put('/questions/:question_id/report', (req, res) => {
	// Parameters: question_id
	// Expected Response: Status: 204 NO CONTENT
	update();
	res.status(204).send('NO CONTENT'); // Expected Status: 204 NO CONTENT
});

// =============================================
//                Answers
// =============================================
// Answers List
// GET /qa/questions/:question_id/answers

// Parameters: question_id
// Query Parameters: page, count
router.get('/questions/:question_id/answers', (req, res) => {
	let id = req.params.question_id;

  fetch(`${id}/answers`, (err, payload) => {
		if (err) {
			console.log('FETCH A\'s Error:', err);
			res.status(500).json(err);
		} else {
			// console.log('A Data', payload);
			res.status(200).json(payload); // Expected Status: 200 OK
		}
	});
});

// Add an Answer
// POST /qa/questions/:question_id/answers
router.post('/questions/:question_id/answers', (req, res) => {
	// Parameters: question_id
	// Body Parameters: body, name, email, photos
	save();
	res.status(201).send('CREATED'); // Expected Response: Status: 201 CREATED
});

// Mark Answer as Helpful
// PUT /qa/answers/:answer_id/helpful
router.put('/answers/:answer_id/helpful', (req, res) => {
	// Parameters: answer_id
	res.status(204).send('NO CONTENT'); // Expected Status: 204 NO CONTENT
});

// Report Answer
// PUT /qa/answers/:answer_id/report
router.put('/answers/:answer_id/report', (req, res) => {
	// Parameters: answer_id
	res.status(204).send('NO CONTENT'); // Expected Status: 204 NO CONTENT
});

module.exports = router;