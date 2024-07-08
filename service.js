const bcryptjs = require('bcryptjs');
const { 
    userSchemaModel,
    productSchemaModel,
    cartSchemaModel,
    wishlistSchemaModel,
    } = require('./schema');
const jwt = require('jsonwebtoken');



const handleRegister = async (req, res) => {
    const { name, email, password } = req.body;
    if (name && email && password) {

        const user = await userSchemaModel.findOne({ email });
        if (user) {
            return res.send({
                message: 'Email is already registered',
                data: null
            });
        }

        const docCount = userSchemaModel.estimatedDocumentCount();

        const myHashPassword = await bcryptjs.hash(password, 10);


        const data = await userSchemaModel.create({
            id: docCount + 1,
            name,
            email,
            password: myHashPassword,
        });



        if (data) {

            const token = jwt.sign({ name: data.name, email: data.email }, process.env.JWT_SECRET);

            return res.status(200).json({
                message: 'Registered Successfully',
                user: {
                        name: data.name,
                        email: data.email,
                    },
                Token: token
            });
        } else {
            return res.send({
                message: 'Registered Failed',
                data: null
            });
        }

    }


}

const handleLogin = async (req, res) => {
    const { email, password } = req.query;

    if (email && password) {
        const user = await userSchemaModel.findOne({ email });

        if (user) {
            const isPasswordMatch = await bcryptjs.compare(password, user.password);
            if (isPasswordMatch) {

                const token = jwt.sign({ name: user.name, email: user.email }, process.env.JWT_SECRET);


                res.send({
                    message: 'Login Successful',
                    user: {
                        name: user.name,
                        email: user.email,
                    },
                    Token: token
                });
                return
            } else {
                res.status(400).json({
                    message: 'Password is not matched',
                    data: null
                });
                // res.send({
                //     message: 'Password is not matched',
                //     data: null
                // });
                return;
            }

        }else{
            res.send({
                message:'Email is not registered',
            })
        }
    }
}

const handleGetCart = async (req, res) => {
    const {user_email } = req.query;

    const cart = await cartSchemaModel.find({ email:user_email });

    const detailCarts=[]

    if (cart && cart.length > 0) {
        
        for(let i=0;i<cart.length;i++){
            const product = await productSchemaModel.findOne({ _id: cart[i].productId });
            if(product.price){
                product.price = product.price
            }else{
                product.price = 699
            }
            detailCarts.push({
                productId: product._id,
                title: product.title,
                price: product.price,
                quantity: cart[i].quantity,
                image: product.images,
            })
        }

        res.send({
            message: 'Cart is retrieved successfully',
            data: detailCarts,
        });
        return;

    }else{
        res.send({
            message: 'No cart found',
            data: null
        });
    }

}

const handleAddToCart = async (req, res) => {
    const {email, product_id, quantity } = req.body;

    const confirm = await cartSchemaModel.findOne({ email:email, productId: product_id });

    if (confirm) {
        if(confirm.quantity == quantity){
            res.send({
                message: 'Product is already in cart',
                data: null
            });
            return;
        }
        const result = await cartSchemaModel.updateOne({email:email, productId: product_id},
         {$set: {quantity: quantity}});

        if (result) {
            res.send({ 
                message: 'Product Quantity is updated',
                data: result
            });
        }else{
            res.send({
                message: 'Product is not updated',
                data: null
            });
        }
    }else{
        const result = await cartSchemaModel.create({email:email, productId: product_id, quantity});

        if (result) {
            res.send({
                message: 'Product is added to cart',
                data: result
            });
        }else{
            res.send({
                message: 'Product is not added to cart',
                data: null
            });
        }
}
}

const handleRemoveFromCart = async (req, res) => {
  const { product_id,email } = req.query;

  const result = await cartSchemaModel.deleteOne({email:email, productId: product_id});

  if (result) {
      res.send({
          message: 'Product is removed from cart',
          data: result
      });
  }else{
      res.send({
          message: 'Product is not removed from cart',
          data: null
      });
  }
}

const handleAddToWishlist = async (req, res) => {
  const { product_id,email } = req.body;

    const confirm = await wishlistSchemaModel.findOne({ email:email, productId: product_id });

    if (confirm) {
        res.send({
            message: 'Product is already in wishlist',
            data: null
        });
        return;
    }
  

  const result = await wishlistSchemaModel.create({email:email, productId: product_id});

  if (result) {
      res.send({
          message: 'Product is added to wishlist',
          data: result
      });
  }else{
      res.send({
          message: 'Product is not added to wishlist',
          data: null
      });
  }
}

const handleGetWishlist = async (req, res) => {
  const {user_email} = req.query;

  const wishlist = await wishlistSchemaModel.find({ email:user_email });

  const detailWishlists=[]

  if (wishlist && wishlist.length > 0) {
    
    for(let i=0;i<wishlist.length;i++){
      const product = await productSchemaModel.findOne({ _id: wishlist[i].productId });
      if(product.price){
        product.price = product.price
      }else{
        product.price = 699
      }
      detailWishlists.push({
        productId: product._id,
        title: product.title,
        price: product.price,
        image: product.images,
      })
    }

    res.send({
      message: 'Wishlist is retrieved successfully',
      data: detailWishlists,
    });
    return;

  }else{
    res.send({
      message: 'No wishlist found',
      data: null
    });
  }

}

const handleRemoveFromWishlist = async (req, res) => {
  const { product_id,email } = req.query;

  const result = await wishlistSchemaModel.deleteOne({email:email, productId: product_id});

  if (result) {
      res.send({
          message: 'Product is removed from wishlist',
          data: result
      });
  }else{
      res.send({
          message: 'Product is not removed from wishlist',
          data: null
      });
  }
}


module.exports = {
    handleRegister,
    handleLogin,
    handleAddToCart,
    handleGetCart,
    handleRemoveFromCart,
    handleAddToWishlist,
    handleRemoveFromWishlist,
    handleGetWishlist
}