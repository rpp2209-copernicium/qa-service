const fs = require('fs');
const csv = require('csvtojson');
const { Transform, pipeline } = require('stream');
const { transformOneAnswer, transformOneAnswerPhoto, transformOneQuestion } = require('../transform.js');

// =============================================
// 					 PHOTOS Rows: 2,063,759
// =============================================
const photosInputStream = fs.createReadStream('./data/answers_photos.csv');
const photosOutputStream = fs.createWriteStream('./data/answers_photos.ndjson');

// If you want json instead of ndjson format,
// pass { downstreamFormat: 'array' } as an argument to csv()
const csvParser = csv();

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

// Photos ETL Pipeline
pipeline(photosInputStream, csvParser, transformPhotoStream, photosOutputStream, (err, payload) => {
	if (err) {
  console.log('There was a problem in the AnswerPhotos Pipeline', err);
} else {
	console.log('Pipeline completed successfully!');
}
});