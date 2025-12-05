import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const mongoUri = process.env.MONGO_URI;
const mongoDbName = process.env.MONGO_DB_NAME || 'db1';

if (!mongoUri) {
  console.error('❌ MONGO_URI is not set in your .env file');
  process.exit(1);
}

// Build connection string (same logic as server.js)
let mongoConnectionString;
if (!mongoUri) {
  mongoConnectionString = `mongodb://localhost:27017/${mongoDbName}`;
} else if (mongoUri.includes('mongodb+srv')) {
  const urlParts = mongoUri.split('?');
  const baseUri = urlParts[0];
  const queryString = urlParts[1] ? `?${urlParts[1]}` : '';
  
  const pathParts = baseUri.split('/');
  if (pathParts.length > 3 && pathParts[3] && pathParts[3].trim() !== '') {
    mongoConnectionString = mongoUri;
  } else {
    mongoConnectionString = `${baseUri}/${mongoDbName}${queryString}`;
  }
} else {
  if (mongoUri.includes('/') && mongoUri.split('/').length > 3) {
    const lastPart = mongoUri.split('/').pop();
    if (lastPart && !lastPart.includes('?')) {
      mongoConnectionString = mongoUri;
    } else {
      mongoConnectionString = mongoUri.includes('?')
        ? mongoUri.replace('?', `/${mongoDbName}?`)
        : `${mongoUri}/${mongoDbName}`;
    }
  } else {
    mongoConnectionString = `${mongoUri}/${mongoDbName}`;
  }
}

console.log('🔍 Testing MongoDB Connection...\n');
console.log(`Database: ${mongoDbName}`);
console.log(`Connection: ${mongoConnectionString.replace(/:[^:@]+@/, ':****@')}\n`);

// Additional diagnostic information
console.log('📋 Diagnostic Information:');
console.log(`   Node.js version: ${process.version}`);
console.log(`   Platform: ${process.platform}`);
console.log(`   Connection timeout: 10 seconds\n`);

mongoose
  .connect(mongoConnectionString, {
    serverSelectionTimeoutMS: 15000,
    connectTimeoutMS: 15000,
    socketTimeoutMS: 15000,
    dbName: mongoDbName,
    retryWrites: true,
    w: 'majority'
  })
  .then(() => {
    console.log('✅ Connection successful!');
    console.log(`✅ Connected to database: ${mongoDbName}`);
    
    // Test a simple operation
    mongoose.connection.db.admin().ping()
      .then(() => {
        console.log('✅ Database ping successful!');
        process.exit(0);
      })
      .catch((err) => {
        console.log('⚠️  Connected but ping failed:', err.message);
        process.exit(0);
      });
  })
  .catch((error) => {
    console.error('\n❌ Connection failed!\n');
    console.error('Error Type:', error.name);
    console.error('Error Code:', error.code);
    console.error('Error Message:', error.message);
    
    if (error.code === 'ETIMEOUT' || error.name === 'MongoServerSelectionError') {
      console.error('\n🔴 DNS Resolution Timeout - This usually means:');
      console.error('   1. Your IP address is NOT whitelisted in MongoDB Atlas');
      console.error('   2. Your network/firewall is blocking the connection');
      console.error('   3. The MongoDB cluster might be paused (free tier)\n');
      
      console.error('📋 Step-by-Step Fix:\n');
      console.error('STEP 1: Whitelist Your IP Address');
      console.error('   → Go to: https://cloud.mongodb.com/');
      console.error('   → Click "Network Access" in left sidebar');
      console.error('   → Click "Add IP Address" button');
      console.error('   → Click "ALLOW ACCESS FROM ANYWHERE" (0.0.0.0/0)');
      console.error('   → Click "Confirm"');
      console.error('   → ⏳ WAIT 2-3 MINUTES for changes to take effect\n');
      
      console.error('STEP 2: Check if Cluster is Running');
      console.error('   → Go to: https://cloud.mongodb.com/');
      console.error('   → Check your cluster status');
      console.error('   → If paused, click "Resume" or "Resume Cluster"\n');
      
      console.error('STEP 3: Verify Connection String');
      console.error('   → Make sure username and password are correct');
      console.error('   → Special characters in password must be URL-encoded');
      console.error('   → Example: @ becomes %40, # becomes %23\n');
      
      console.error('STEP 4: Test Again');
      console.error('   → Run: npm run test:connection\n');
      
      console.error('💡 Quick Check:');
      console.error('   → Can you access https://cloud.mongodb.com/ in your browser?');
      console.error('   → If yes, it\'s likely an IP whitelist issue');
      console.error('   → If no, check your internet connection\n');
    } else if (error.message.includes('authentication')) {
      console.error('\n🔴 Authentication Failed:');
      console.error('   → Check your username and password');
      console.error('   → Go to Atlas → Database Access → Verify user exists');
      console.error('   → Make sure password doesn\'t have unencoded special characters\n');
    } else {
      console.error('\n🔴 Other Error:');
      console.error('   → Check MongoDB Atlas status: https://status.mongodb.com/');
      console.error('   → Verify your connection string format\n');
    }
    
    process.exit(1);
  });

