const path = require("path");
const express = require('express')
const app = express();
const port = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
	res.send('Hello API World');
});

app.use('/qa', require('./routes/questions'));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});