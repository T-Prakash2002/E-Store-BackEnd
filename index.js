const express = require('express');
const app = express();
const {connectDB} = require('./db');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();


app.use(cors());
app.use(bodyParser.json());

const {
  verifyUser,
  handleRegister,
   handleLogin,
   handleAddToCart,
   handleGetCart,
   handleRemoveFromCart,
   handleAddToWishlist,
   handleGetWishlist,
   handleRemoveFromWishlist,
   } = require('./service');



const auth=(req,res,next)=>{
  
  console.log(req.path);
  if(req.path == '/login' || req.path == '/register'){
    next();
  }else{
    const token = req.headers.authorization;

    if(token){

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      verifyUser(decoded.name,decoded.email).then(response => {
      if (response) {
        next();
      } else {
        res.send({
          message: 'Invalid Credentials',
        });

      }
    });



    }else{
      res.send({
        message: 'No token provided',
      });
    }
 
  }
}
app.use(auth)

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

