const fs = require('fs');
const csv = require('csvtojson');
const { Transform, pipeline } = require('stream');
const { transformOneAnswer, transformOneAnswerPhoto, transformOneQuestion } = require('../transform.js');

// =============================================
// 					 QUESTION Rows: 3,518,963
// =============================================
const questionsInputStream = fs.createReadStream('./data/questions.csv');
const questionsOutputStream = fs.createWriteStream('./data/questions.ndjson'); // new-line delimited json

// If you want json instead of ndjson format,
// pass { downstreamFormat: 'array' } as an argument to csv()
const csvParser = csv();

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

// Questions Pipeline
pipeline(questionsInputStream, csvParser, transformQStream, questionsOutputStream, (err) => {
	if (err) {
  console.log('There was a problem in the Questions Pipeline', err);
} else {
	console.log('Pipeline completed successfully!');
}
});