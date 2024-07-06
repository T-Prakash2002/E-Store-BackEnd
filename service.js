const bcryptjs = require('bcryptjs');
const { 
    userSchemaModel,
    productSchemaModel,
    cartSchemaModel,
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

const handleAddToCart = async (req, res) => {
    const { user_email, product_id, quantity } = req.body;

    const confirm = await cartSchemaModel.findOne({ email: user_email, productId: product_id });

    if (confirm) {
        if(confirm.quantity == quantity){
            res.send({
                message: 'Product is already in cart',
                data: null
            });
            return;
        }
        const result = await cartSchemaModel.updateOne({email: user_email, productId: product_id},
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
        const result = await cartSchemaModel.create({email: user_email, productId: product_id, quantity});

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



module.exports = {
    handleRegister,
    handleLogin,
    handleAddToCart,
}