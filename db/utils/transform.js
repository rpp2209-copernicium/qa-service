const transformOneAnswer = (answer) => {
	return {
		id: answer.id,
		question: answer.question_id,
		body: answer.body,
		created_at: answer.date_written,
		answerer_name: answer.answerer_name,
		reported: answer.reported,
		helpful: answer.helpful
	}
};

const transformOneAnswerPhoto = (photo) => {
	return {
		id: photo.id,
		answer: photo.answer_id,
		url: photo.url
	}
};

const transformOneQuestion = (question) => {
	return {
		id: question.id,
		product: question.product_id,
		body: question.body,
		created_at: question.date_written,
		asker_name: question.asker_name,
		reported: question.reported,
		helpful: question.helpful
	}
};

module.exports = { transformOneQuestion, transformOneAnswer, transformOneAnswerPhoto };