const fs = require('fs');

// COUNT CSV ROWS
function countFileLines(filePath) {
  return new Promise((resolve, reject) => {
		let rows = 0;

		fs.createReadStream(filePath)
			.on("data", (chunk) => {

				let idx = -1;
				rows--; // Because the loop will run once for idx = -1

				do {
					idx = chunk.indexOf(10, idx + 1);
					rows++;
				} while (idx !== -1);

			}).on("end", () => {
				resolve(rows);
			}).on("error", reject);
  });
};

// // ROW LOGGER
countFileLines('./data/questions.csv').then(result => console.log('Question CSV Rows:', result));
countFileLines('./data/answers.csv').then(result => console.log('Answer CSV Rows:', result));
countFileLines('./data/answers_photos.csv').then(result => console.log('Photo CSV Rows:', result));

// TRANSFORMED ROW LOGGER
countFileLines('./data/questions.ndjson').then(result => console.log('Question Transformed Rows:', result));
countFileLines('./data/answers.ndjson').then(result => console.log('Answer Transformed Rows:', result));
countFileLines('./data/answers_photos.ndjson').then(result => console.log('Photo Transformed Rows:', result));