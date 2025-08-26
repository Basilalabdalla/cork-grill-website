const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  try {
    
    const dbName = process.env.MONGO_URI.split('/').pop().split('?')[0] || 'corkgrill_prod';
    
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: dbName, 
    });

    console.log(`MongoDB Connected: ${conn.connection.host} to database "${dbName}"`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;