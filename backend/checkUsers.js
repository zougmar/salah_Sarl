import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.model.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
const mongoUri = process.env.MONGO_URI ;
const mongoDbName = process.env.MONGO_DB_NAME || 'salahelec';
const mongoConnectionString = mongoUri.includes('mongodb+srv') || mongoUri.includes('?')
  ? mongoUri
  : `${mongoUri}/${mongoDbName}`;

// Check users in database
const checkUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(mongoConnectionString);
    console.log('Connected to MongoDB');

    // Get all users
    const users = await User.find({});

    console.log('Users in database:');
    if (users.length === 0) {
      console.log('No users found in the database');
    } else {
      users.forEach(user => {
        console.log(`- ${user.name} (${user.email}) - Role: ${user.role}`);
      });
    }

  } catch (error) {
    console.error('Error checking users:', error);
  } finally {
    // Close the connection
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
};

// Run the check
checkUsers();
