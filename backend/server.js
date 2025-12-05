import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.routes.js';
import taskRoutes from './routes/task.routes.js';
import userRoutes from './routes/user.routes.js';
import commentRoutes from './routes/comment.routes.js';
import locationRoutes from './routes/location.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Connect to MongoDB
const mongoUri = process.env.MONGO_URI;
const mongoDbName = process.env.MONGO_DB_NAME || 'db1';

// Build connection string
let mongoConnectionString;
if (!mongoUri) {
  // Default to local MongoDB
  mongoConnectionString = `mongodb://localhost:27017/${mongoDbName}`;
} else if (mongoUri.includes('mongodb+srv')) {
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

// Start the server first
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  
  // Then connect to MongoDB
  mongoose
    .connect(mongoConnectionString, {
      serverSelectionTimeoutMS: 10000, // Timeout after 10s
      connectTimeoutMS: 10000, // Give up initial connection after 10s
      dbName: mongoDbName, // Explicitly set database name
    })
    .then(() => {
      console.log(`✅ Connected to MongoDB (Database: ${mongoDbName})`);
    })
    .catch((err) => {
      console.error('❌ MongoDB connection error:', err);
      // Don't exit the process, just continue without MongoDB
    });
});

export default app;

