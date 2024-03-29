const express = require('express');
const router = express.Router();
const axios = require('axios');

const { fetch, save, update  } = require('../../utils/db.js');


// =============================================
//                Questions
// =============================================
// ✅ GET Questions
// GET /qa/questions
// Parameters: product_id (int), page (int), count (int)
router.get('/questions', async (req, res) => {
	let url = req.url.slice(1)
	//console.log('URL LOG IS RIGHT HERE!', req.url);
	
	await fetch(url, (err, payload) => {
		if (err) {
			console.log('Error From QA Microservice GET Questions:', err);
			res.status(500).send(err);
		} else {
			console.log('QA Microservice GET Questions Payload', payload);
			res.status(200).send(payload); 
		}
	});
});

// ✅ Add a Question
// POST /qa/questions
// Body Parameters: body, name, email, product_id
router.post('/questions', async (req, res) => {
	console.log('GOT Add Q BODY', req.body);

	const question = {
		product_id: req.body.product_id,
		question_body: req.body.question_body,
		asker_name: req.body.asker_name,
		asker_email: req.body.asker_email
	};

	await save('questions', question, (err, payload) => {
		if (err) {
			console.log('POST Question Error:', err)
			res.status(500).json(err);
		} else {
			console.log('SAVE Q PAYLOAD: ', payload);
			res.status(201).send('CREATED'); // Expected Status: 201 CREATED
		}
	});

});

// Mark Question as Helpful
// PUT /qa/questions/:question_id/helpful
router.put('/questions/:question_id/helpful', (req, res) => {
	// Parameters: question_id
	update('helpful', { id: req.params['question_id'] }, (err, payload) => {
		if (err) {
			console.log('Report Q Helpful Err', err);
			res.status(500).send(err);
		} else {
			console.log('Report Question HELPFUL SUCCESS: ', payload);
			res.status(204).send('NO CONTENT'); // Expected Status: 204 NO CONTENT
		}
	});

});

// Report Question
// PUT /qa/questions/:question_id/report
// Parameters: question_id
router.put('/questions/:question_id/report', async (req, res) => {
	console.log('QA MS RPT QS URL: ', req.url);
	
	await update('reported', { id: req.params['question_id'], value: true }, (err, payload) => {
		if (err) {
			console.log('Report Question Error: ', err);
			res.status(500).send(err);
		} else {
			console.log('Report Question SUCCESS: ', payload);
			res.status(204).send('NO CONTENT'); // Expected Status: 204 NO CONTENT
		}
	});
});

// =============================================
//                Answers
// =============================================
// ✅ GET Answers
// GET /qa/questions/:question_id/answers
// Parameters: question_id, page, count
router.get('/questions/:question_id/answers', (req, res) => {
	let url = req.url.slice(1);
  fetch(url, (err, payload) => {
		if (err) {
			console.log('FETCH A\'s Error:', err);
			res.status(500).json(err);
		} else {
			// console.log('A Data', payload);
			res.status(200).json(payload); // Expected Status: 200 OK
		}
	});
});

// ✅ Add an Answer
// POST /qa/questions/:question_id/answers
// Parameters: question_id, body, name, email, photos
router.post('/questions/:question_id/answers', async (req, res) => {
	// console.log('GOT Create A BODY', req.body);

	const answer = {
		answer_body: req.body.answer_body,
		answerer_name: req.body.answerer_name,
		answerer_email: req.body.answerer_email,
		question_id: req.params.question_id
	};

	await save('answers', answer, (err, payload) => {
		if (err) {
			console.log('POST A Error:', err)
			res.status(500).json(err);
		} else {
			console.log('SAVE A PAYLOAD: ', payload);
			res.status(201).send('CREATED'); // Expected Status: 201 CREATED
		}
	});
});

// Mark Answer as Helpful
// PUT /qa/answers/:answer_id/helpful
// Parameters: answer_id
router.put('/answers/:answer_id/helpful', async (req, res) => {

	await update('helpful', { id: req.params['answer_id'], table: 'answers' }, (err, payload) => {
		if (err) {
			console.log('Report A Helpful Err', err);
			res.status(500).send(err);
		} else {
			console.log('Report A HELPFUL SUCCESS: ', payload);
			res.status(204).send('NO CONTENT'); 
		}
	});
	
});

// Report Answer
// PUT /qa/answers/:answer_id/report
// Parameters: answer_id
router.put('/answers/:answer_id/report', async (req, res) => {
	
	await update('reported', { table: 'answers', id: req.params['answer_id'], value: true }, (err, payload) => {
		if (err) {
			console.log('Report A Error: ', err);
			res.status(500).send(err);
		} else {
			console.log('Report A SUCCESS: ', payload);
			res.status(204).send('NO CONTENT'); // Expected Status: 204 NO CONTENT
		}
	});
});

module.exports = router;
