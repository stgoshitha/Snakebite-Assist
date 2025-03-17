const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MongoURL);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('Not connected to the MongoDB database:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
