const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is required');
}

mongoose.set('strictQuery', true);

async function connectDb() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  await mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 10000
  });

  return mongoose.connection;
}

module.exports = { connectDb };
