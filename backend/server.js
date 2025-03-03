import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from './models/User.js';  
import authRoutes from './routes/auth.js';            // Android app authentication routes
import authWebRoutes from './routes/auth-web.js';       // Web app authentication routes
import gymRoutes from './routes/gym.js';                // Gym routes
import androidGymsRoutes from './routes/android-gyms.js'; // Android gyms route
import feedbackRoutes from './routes/feedback.js';

// Initialize express app
const app = express();

// Load environment variables
dotenv.config();

// Check MongoDB URI
if (!process.env.MONGODB_URI) {
  console.error("❌ MONGODB_URI is not set in .env file!");
  process.exit(1);
} else {
  console.log('✅ MONGODB_URI loaded successfully');
}

// Get the directory path in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the uploads directory exists
const uploadDir = path.resolve(__dirname, 'uploads');
console.log('Uploads directory path:', uploadDir);

try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('Uploads directory created successfully');
  }
} catch (error) {
  console.error('Error creating uploads directory:', error);
}

// CORS Configuration
const corsOptions = {
  origin: ['http://localhost:5173', 'https://gym-pro5.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ 
  extended: true, 
  limit: '10mb' 
}));

// Serve static files from uploads directory
app.use('/uploads', express.static(uploadDir));

// Log request details for debugging
app.use((req, res, next) => {
  console.log(`📝 ${new Date().toISOString()} - ${req.method} ${req.url}`);
  if (req.method !== 'GET') {
    console.log('📦 Request Body:', req.body);
  }
  next();
});

// Updated MongoDB connection configuration
const mongooseOptions = {
  serverSelectionTimeoutMS: 5000,  // 5 seconds for server selection
  socketTimeoutMS: 45000,          // 45 seconds for socket operations
  retryWrites: true                // Enable retryable writes
};

const connectWithRetry = () => {
  mongoose.connect(process.env.MONGODB_URI, mongooseOptions)
    .then(() => {
      console.log('✅ Connected to MongoDB');
      // Verify connection status
      console.log('Connection readyState:', mongoose.connection.readyState);
    })
    .catch(err => {
      console.error('❌ MongoDB connection error:', err.message);
      console.log('Retrying in 5 seconds...');
      setTimeout(connectWithRetry, 5000);
    });
};

// Configure Mongoose connection events
mongoose.connection.on('connected', () => {
  console.log('📢 MongoDB Connection Established');
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB Disconnected!');
  // Mongoose will automatically attempt to reconnect
});

mongoose.connection.on('reconnected', () => {
  console.log('♻️ MongoDB Reconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB Connection Error:', err.message);
});

// Configure Mongoose defaults
mongoose.set('strictQuery', true);  // Recommended for future compatibility
mongoose.set('bufferCommands', false); // Disable command buffering

// Start initial connection
connectWithRetry();

// Root Route
app.get('/', (req, res) => {
  res.json({ 
    status: 'success', 
    message: '✨ Welcome to GymPro™ API' 
  });
});

// Use Android Authentication Routes (defined in ./routes/auth.js)
app.use('/auth', authRoutes);

// Web Routes
app.use('/api/auth', authRoutes);     // Android app authentication
app.use('/api/auth-web', authWebRoutes);     // Web app authentication
app.use('/api/gyms', gymRoutes);           // Gym routes
app.use('/api/android', androidGymsRoutes); // Android gyms route
app.use('/api/feedback', feedbackRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    mongo: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  console.error('Stack:', err.stack);
  
  // Clean up any uploaded files if there's an error
  if (req.file) {
    try {
      fs.unlinkSync(req.file.path);
      console.log('🧹 Cleaned up uploaded file after error');
    } catch (unlinkError) {
      console.error('❌ Error cleaning up file:', unlinkError);
    }
  }
  
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 Local: http://localhost:${PORT}`);
  console.log('🚀 GymPro™ API is ready!');
});