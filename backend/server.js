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
import managerRoutes from './routes/managerRoutes.js';

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
  origin: ['http://localhost:5173', 'https://gym-pro5.vercel.app', 'http://gym-pro5.vercel.app'],
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

// MongoDB Connection with retries
const connectWithRetry = () => {
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  };

  mongoose.connect(process.env.MONGODB_URI, options)
    .then(() => {
      console.log('✅ Connected to MongoDB');
    })
    .catch(err => {
      console.error('❌ MongoDB connection error:', err);
      console.log('Retrying in 5 seconds...');
      setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();

// Handle MongoDB connection events
mongoose.connection.on('error', err => {
  console.error('❌ MongoDB Error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB Disconnected! Attempting to reconnect...');
  mongoose.connect(process.env.MONGODB_URI);
});

// Root Route
app.get('/', (req, res) => {
  res.json({ 
    status: 'success', 
    message: '✨ Welcome to GymPro™ API' 
  });
});

// Centralized route configuration
app.use('/api/gyms', gymRoutes);
app.use('/api/managers', managerRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/web', authWebRoutes);

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
