// Comment New Relic OUT while stress-testing
// const newrelic = require("newrelic");

const http = require('http');
const path = require("path");
const express = require('express')
const app = express();

const port = process.env.PORT || 8080;
const routes = require('./routes/questions.js');
const { fetch } = require('../utils/db.js');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello 8080');
});

app.use('/qa', routes);

app.listen(port, () => {
  console.log(`Server running on port 8080`);
});

