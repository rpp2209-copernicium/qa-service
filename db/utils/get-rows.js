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

// ROW LOGGER
countFileLines('./data/questions.csv').then(result => console.log('Q Rows:', result));
countFileLines('./data/answers.csv').then(result => console.log('A Rows:', result));
countFileLines('./data/answers_photos.csv').then(result => console.log('P Rows:', result));