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


// =============================================
//    REMOVE THIS WHEN EC2 FULLY DEBUGGED
// =============================================
app.get('/qa/questions', async (req, res) => {
  
  await fetch('/questions', (err, payload) => {
    if(err) {
      console.log('There was an error in QA fake fetch => server/index.js', err);
      res.status(500).send(err);
    } else {
      console.log('Payload', payload);
      res.status(200).send(payload);
    }
  })
  
});

// =============================================
//    PUT THI BACK WHEN EC2 FULLY DEBUGGED
// =============================================
// app.use('/qa', routes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});