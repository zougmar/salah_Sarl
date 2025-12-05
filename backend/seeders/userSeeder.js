import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcryptjs from 'bcryptjs';
import User from '../models/User.model.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017';
const mongoDbName = process.env.MONGO_DB_NAME || 'db1';

// Build connection string
let mongoConnectionString;
if (mongoUri.includes('mongodb+srv')) {
  // MongoDB Atlas connection
  const urlParts = mongoUri.split('?');
  const baseUri = urlParts[0];
  const queryString = urlParts[1] ? `?${urlParts[1]}` : '';
  
  // Check if database name is already in the base URI
  const pathParts = baseUri.split('/');
  if (pathParts.length > 3 && pathParts[3] && pathParts[3].trim() !== '') {
    // Database name already exists, use as is
    mongoConnectionString = mongoUri;
  } else {
    // Add database name before query string
    mongoConnectionString = `${baseUri}/${mongoDbName}${queryString}`;
  }
} else {
  // Local MongoDB connection
  if (mongoUri.includes('/') && mongoUri.split('/').length > 3) {
    // Database name might already be in URI
    const lastPart = mongoUri.split('/').pop();
    if (lastPart && !lastPart.includes('?')) {
      // Has database name, use as is
      mongoConnectionString = mongoUri;
    } else {
      // No database name, add it
      mongoConnectionString = mongoUri.includes('?')
        ? mongoUri.replace('?', `/${mongoDbName}?`)
        : `${mongoUri}/${mongoDbName}`;
    }
  } else {
    // No path, add database name
    mongoConnectionString = `${mongoUri}/${mongoDbName}`;
  }
}

// Default users data
const defaultUsers = [
  {
    name: 'Admin User',
    email: 'admin@admin.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    name: 'John Employee',
    email: 'employee@employee.com',
    password: 'employee123',
    role: 'employee'
  }
];

// Function to seed users
const seedUsers = async () => {
  try {
    // Connect to MongoDB
    console.log('Attempting to connect to MongoDB...');
    console.log(`Connection string: ${mongoConnectionString.replace(/:[^:@]+@/, ':****@')}`); // Hide password
    
    await mongoose.connect(mongoConnectionString, {
      serverSelectionTimeoutMS: 30000, // Timeout after 30s
      connectTimeoutMS: 30000, // Give up initial connection after 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      maxPoolSize: 10, // Maintain up to 10 socket connections
      retryWrites: true, // Retry write operations
      w: 'majority', // Write concern
      dbName: mongoDbName, // Explicitly set database name
      // Additional options for better connection handling
      heartbeatFrequencyMS: 10000,
      retryReads: true
    });
    console.log(`✅ Connected to MongoDB (Database: ${mongoDbName})`);

    // Check if users already exist
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists. Skipping seeding.');
      return;
    }

    // Hash passwords and create users
    const hashedUsers = await Promise.all(
      defaultUsers.map(async (user) => {
        const hashedPassword = await bcryptjs.hash(user.password, 12);
        return {
          ...user,
          password: hashedPassword
        };
      })
    );

    // Insert users into database
    await User.insertMany(hashedUsers);
    console.log('Default users created successfully');

    // Log the created users with credentials
    console.log('\n✅ Default users created successfully!\n');
    console.log('📋 Default Admin Credentials:');
    console.log('   Email: admin@admin.com');
    console.log('   Password: admin123');
    console.log('\n📋 Default Employee Credentials:');
    console.log('   Email: employee@employee.com');
    console.log('   Password: employee123');
    console.log('\n');

  } catch (error) {
    console.error('\n❌ Error seeding users:', error.message);
    
    if (error.code === 'ETIMEOUT' || error.name === 'MongoServerSelectionError') {
      console.error('\n🔍 Troubleshooting Steps:');
      console.error('1. Check if your IP address is whitelisted in MongoDB Atlas:');
      console.error('   - Go to Atlas Dashboard → Network Access');
      console.error('   - Click "Add IP Address"');
      console.error('   - Click "Allow Access from Anywhere" (for development)');
      console.error('   - Wait 1-2 minutes for changes to take effect\n');
      
      console.error('2. Verify your connection string in .env file:');
      console.error('   - Make sure MONGO_URI is set correctly');
      console.error('   - Format: mongodb+srv://username:password@cluster.xxxxx.mongodb.net/db1?retryWrites=true&w=majority');
      console.error('   - Replace username and password with your Atlas credentials\n');
      
      console.error('3. Check your internet connection and firewall settings\n');
      
      console.error('4. Try using MongoDB Compass to test the connection first\n');
    } else if (error.message.includes('authentication')) {
      console.error('\n🔍 Authentication Error:');
      console.error('   - Verify your username and password in the connection string');
      console.error('   - Make sure special characters in password are URL-encoded\n');
    }
    
    console.error('Full error details:', error);
  } finally {
    // Close the connection
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
};

// Run the seeder
seedUsers();
