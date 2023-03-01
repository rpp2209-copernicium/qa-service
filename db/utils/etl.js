const fs = require('fs');
const csv = require('csvtojson');
const { Transform, pipeline } = require('stream');
const { transformOneAnswer, transformOneAnswerPhoto, transformOneQuestion } = require('./transform.js');

// Questions Stream
const questionsInputStream = fs.createReadStream('./data/questions.csv');
const questionsOutputStream = fs.createWriteStream('./data/questions.ndjson'); // new-line delimited json

// Answers Stream
const answersInputStream = fs.createReadStream('./data/answers.csv');
const answersOutputStream = fs.createWriteStream('./data/answers.ndjson');

// Photos Stream
const photosInputStream = fs.createReadStream('./data/answers_photos.csv');
const photosOutputStream = fs.createWriteStream('./data/answers_photos.ndjson');

// If you want json instead of ndjson format,
// pass { downstreamFormat: 'array' } as an argument to csv()
const csvParser = csv();

// TRANSFORM QUESTION STREAM
const transformQStream = new Transform({

	transform(record, encoding, cb) {
		try {
			let recordObj = JSON.parse(record);
			let transformed = transformOneQuestion(recordObj);;
			let string = `${JSON.stringify(transformed)}\n`;
			cb(null, string);
		} catch (err) {
			cb(err)
		}
	}

});

// TRANSFORM ANSWER STREAM
const transformAStream = new Transform({

	transform(record, encoding, cb) {
		try {
			let recordObj = JSON.parse(record);
			let transformed = transformOneAnswer(recordObj);;
			let string = `${JSON.stringify(transformed)}\n`;
			cb(null, string);
		} catch (err) {
			cb(err)
		}
	}

});

// TRANSFORM PHOTO STREAM
const transformPhotoStream = new Transform({

	transform(record, encoding, cb) {
		try {
			let recordObj = JSON.parse(record);
			let transformed = transformOneAnswerPhoto(recordObj);;
			let string = `${JSON.stringify(transformed)}\n`;
			cb(null, string);
		} catch (err) {
			cb(err)
		}
	}

});



// ETL PIPELINE

// Questions Stream
pipeline(questionsInputStream, csvParser, transformQStream, questionsOutputStream, (err) => {
	if (err) {
  console.log('There was a problem in the Questions Pipeline', err);
} else {
	console.log('Pipeline completed successfully!');
}
});

// Answers Stream
pipeline(answersInputStream, csvParser, transformAStream, answersOutputStream, (err) => {
	if (err) {
  console.log('There was a problem in the Answers Pipeline', err);
} else {
	console.log('Pipeline completed successfully!');
}
});

// Photos Stream
pipeline(photosInputStream, csvParser, transformPhotoStream, photosOutputStream, (err, payload) => {
	if (err) {
  console.log('There was a problem in the AnswerPhotos Pipeline', err);
} else {
	console.log('Pipeline completed successfully!');
}
});