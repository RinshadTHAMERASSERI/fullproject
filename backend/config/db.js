const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  try {
    console.log(  process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
  
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('DB Error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;