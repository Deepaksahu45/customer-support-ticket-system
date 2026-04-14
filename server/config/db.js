// Aegis — Database connection configuration
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`🛡️  Aegis MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Aegis DB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
