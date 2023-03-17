const path = require("path");
const express = require('express')
const app = express();
const port = process.env.PORT || 8080;
const routes = require('./routes/questions.js');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
	res.send('Hello API World');
});

app.use('/qa', routes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});