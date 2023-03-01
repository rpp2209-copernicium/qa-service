const fs = require('fs');
const csv = require('csvtojson');
const { Transform, pipeline } = require('stream');
const { transformOneAnswer, transformOneAnswerPhoto, transformOneQuestion } = require('../transform.js');

// =============================================
// 					 ANSWER Rows: 6,879,306
// =============================================
const answersInputStream = fs.createReadStream('./data/answers.csv');
const answersOutputStream = fs.createWriteStream('./data/answers.ndjson');

// If you want json instead of ndjson format,
// pass { downstreamFormat: 'array' } as an argument to csv()
const csvParser = csv();

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


// Answers ETL Pipeline
pipeline(answersInputStream, csvParser, transformAStream, answersOutputStream, (err) => {
	if (err) {
  console.log('There was a problem in the Answers Pipeline', err);
} else {
	console.log('Pipeline completed successfully!');
}
});