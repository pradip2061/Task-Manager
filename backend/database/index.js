const mongoose = require('mongoose');

const connectionString = process.env.CONNECTION_STRING;
console.log(connectionString)
const connectToDatabase = async () => {
  try {
    await mongoose.connect(connectionString)
    console.log('✅ Database connected successfully!');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
};

module.exports = connectToDatabase;