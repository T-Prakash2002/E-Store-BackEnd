const express = require('express');
const app = express();
const {connectDB} = require('./db');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');


app.use(cors());
app.use(bodyParser.json());

const { 
  handleRegister,
   handleLogin,
   handleAddToCart,
   handleGetCart,
   handleRemoveFromCart,
   handleAddToWishlist,
   handleGetWishlist,
   handleRemoveFromWishlist,
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

app.post('/cart/add', (req, res) => {
  handleAddToCart(req, res);
});

app.get('/cart/get', (req, res) => {
  handleGetCart(req, res);
});

app.delete('/cart/remove', (req, res) => {
  handleRemoveFromCart(req, res);
});

app.post(`/wishlist/add`, (req, res) => {
  handleAddToWishlist(req, res);
});

app.get('/wishlist/get', (req, res) => {
  handleGetWishlist(req, res);
});

app.delete('/wishlist/remove', (req, res) => {
  handleRemoveFromWishlist(req, res);
});



app.listen(4000, () => {
  console.log('App listening on port 4000!');
});

