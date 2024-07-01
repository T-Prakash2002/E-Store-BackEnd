const {mongoose} = require('./db');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
});


const userSchemaModel = mongoose.model('users', userSchema);

module.exports = {userSchemaModel};

