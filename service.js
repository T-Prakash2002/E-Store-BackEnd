const bcryptjs = require('bcryptjs');
const { 
    userSchemaModel,
    productSchemaModel 
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

const handleProducts= async (req, res) => {
    const result = await productSchemaModel.find({});
    res.send(result);
}


module.exports = {
    handleRegister,
    handleLogin,
    handleProducts,

}