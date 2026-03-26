const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`[DB] MongoDB connected: ${conn.connection.host}`);

    mongoose.connection.on('error', (err) => {
      console.error(`[DB] MongoDB connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('[DB] MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('[DB] MongoDB reconnected successfully.');
    });

    return conn;
  } catch (error) {
    console.warn(`[DB] MongoDB connection failed: ${error.message}`);
    console.warn('[DB] Server will continue without database — some features may be limited.');
  }
};

module.exports = connectDB;
