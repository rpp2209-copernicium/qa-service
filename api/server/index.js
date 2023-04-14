const http = require('http');
const path = require("path");
const express = require('express')

const app = express();
const app2 = express();

// const ports = [8080, 8081, 8082];
// const port = process.env.PORT || 8080;
const routes = require('./routes/questions.js');

// =============================================
//    REMOVE THIS WHEN EC2 FULLY DEBUGGED
// =============================================
const { fetch } = require('../utils/db.js');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello 8080');
});

app2.get('/', (req, res) => {
  res.send('Hello 8081');
});

// 8080 Loader.io Verification
app.get('/loaderio-f7093aa72c81947cfb37405b167a9022.txt', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'loaderio-f7093aa72c81947cfb37405b167a9022.txt')); 
});

// 8081 Loader.io Verification
app2.get('/loaderio-f7093aa72c81947cfb37405b167a9022.txt', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'loaderio-f7093aa72c81947cfb37405b167a9022.txt')); 
});

app.use('/qa', routes);
app2.use('/qa', routes);

app.listen(8080, () => {
  console.log(`Server running on port 8080`);
});

app2.listen(8081, () => {
  console.log(`Server running on port 8081`);
});

