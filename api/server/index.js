const path = require("path");
const express = require('express')
const app = express();
const port = process.env.PORT || 8080;
const routes = require('./routes/questions.js');

// =============================================
//    REMOVE THIS WHEN EC2 FULLY DEBUGGED
// =============================================
const { fetch } = require('./utils/db.js');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello API World');
});

// Loader.io Verification File
app.get('/loaderio-87557d96b121a3b28e625cbbcbba03d8.txt', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'loaderio-87557d96b121a3b28e625cbbcbba03d8.txt'));
});

app.use('/qa', routes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});