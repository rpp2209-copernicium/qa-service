const path = require("path");
const express = require('express')
const app = express();
const port = process.env.PORT || 8080;
const routes = require('./routes/questions.js');

// ADDING THIS FOR EC2 TESTING ONLY - REMOVE ONCE WORKING
const { fetch } = require('..//utils/db.js');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
	res.send('Hello API World');
});

// Loader.io Verification File
app.get('/loaderio-d208d9f5f1ff49febfb3350a35419274.txt', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'loaderio-d208d9f5f1ff49febfb3350a35419274.txt'));
});

// !! PUT THIS BACK ONCE EC2 DEBUGGED !!
app.use('/qa', routes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
