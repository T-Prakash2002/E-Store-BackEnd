const express = require('express');
const app = express();
const {connectDB} = require('./db');
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.json());

const { 
  handleRegister,
   handleLogin,
   } = require('./service');




connectDB();

app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.post('/register', (req, res) => {
  handleRegister(req, res);
});

app.get('/login', (req, res) => {
  handleLogin(req, res);
});

app.listen(4000, () => {
  console.log('Example app listening on port 4000!');
});

