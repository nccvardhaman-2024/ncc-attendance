const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

console.log('Using MONGODB_URI:', MONGODB_URI);

if (!MONGODB_URI) {
  console.error('No MONGODB_URI found!');
  process.exit(1);
}

mongoose.connect(MONGODB_URI, {
  tlsAllowInvalidCertificates: true
})
  .then(async () => {
    console.log('Connected to MongoDB successfully!');
    
    // List collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections in database:', collections.map(c => c.name));
    
    // Check if there is a User model and users count
    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
    const count = await User.countDocuments();
    console.log('Number of documents in Users collection:', count);

    const users = await User.find().limit(5);
    console.log('Sample users:', users);

    await mongoose.connection.close();
    process.exit(0);
  })
  .catch(err => {
    console.error('Database connection failed:', err);
    process.exit(1);
  });
