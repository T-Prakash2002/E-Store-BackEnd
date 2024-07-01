const mongoose = require('mongoose');
const dotenv = require('dotenv').config();


const connectDB = async () => {
    try {
        if (mongoose.connection.readyState === 1) return;
        await mongoose.connect(process.env.MongoDB_URI)
        console.log(mongoose.connection.readyState, " --- Connection State");

    } catch (err) {
        console.log(err);
    }
};


module.exports = { connectDB, mongoose };
