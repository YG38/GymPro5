import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import authWebRoutes from './routes/auth-web.js';
import gymRoutes from './routes/gym.js';
import androidRoutes from './routes/android.js';

// Initialize express app and __dirname equivalent for ES modules
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Enhanced logging function
const log = (message, data = null) => {
  const timestamp = new Date().toISOString();
  const logMessage = {
    timestamp,
    message,
    environment: process.env.NODE_ENV,
    isVercel: process.env.VERCEL === '1',
    ...data && { data }
  };
  console.log(JSON.stringify(logMessage));
};

// Log startup information
log('Starting server...', {
  nodeVersion: process.version,
  platform: process.platform,
  env: process.env.NODE_ENV,
  isVercel: process.env.VERCEL === '1'
});

// Check if we're running on Vercel
const isVercel = process.env.VERCEL === '1';

// Ensure required environment variables are set
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  log('Missing required environment variables', { missing: missingEnvVars });
  process.exit(1);
} else {
  log('All required environment variables loaded');
}

// CORS Configuration
const allowedOrigins = [
  'https://gym-pro5.vercel.app',
  'http://localhost:5173',
  'http://127.0.0.1:5173'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      log('CORS error', { origin });
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Only create uploads directory in development
if (!isVercel) {
  const fs = await import('fs');
  const uploadsDir = path.join(__dirname, 'uploads', 'gym_logos');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    log('Created uploads directory', { path: uploadsDir });
  }
  // Serve static files only in development
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
}

// Request logging middleware
app.use((req, res, next) => {
  const startTime = Date.now();
  
  // Log request
  log('Incoming request', {
    method: req.method,
    url: req.url,
    headers: {
      'content-type': req.headers['content-type'],
      'user-agent': req.headers['user-agent']
    },
    query: req.query,
    body: req.method !== 'GET' ? (
      req.body.password ? 
        { ...req.body, password: '[REDACTED]' } : 
        req.body
    ) : undefined
  });

  // Log response
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    log('Response sent', {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`
    });
  });

  next();
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => log('Connected to MongoDB'))
  .catch(error => {
    log('MongoDB connection error', { error: error.message });
    process.exit(1);
  });

// Health check route
app.get('/', (req, res) => {
  const health = {
    status: 'success',
    message: 'Welcome to GymPro5 API',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  };
  log('Health check', health);
  res.json(health);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/auth-web', authWebRoutes);
app.use('/api/web', gymRoutes);
app.use('/api/android', androidRoutes); 

// 404 Handler
app.use((req, res) => {
  log('Route not found', { url: req.originalUrl });
  res.status(404).json({ 
    success: false, 
    message: `Route ${req.originalUrl} not found` 
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  log('Server Error', {
    error: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method
  });
  
  // Clean up uploaded files on error (only in development)
  if (!isVercel && req.file?.path) {
    const fs = await import('fs');
    try {
      fs.unlinkSync(req.file.path);
      log('Cleaned up uploaded file after error', { path: req.file.path });
    } catch (unlinkError) {
      log('Error cleaning up file', { error: unlinkError.message });
    }
  }
  
  // Send appropriate error response
  const statusCode = err.status || 500;
  const errorResponse = {
    success: false,
    message: err.message || 'Internal server error'
  };

  // Add stack trace in development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }

  res.status(statusCode).json(errorResponse);
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  log('Server started', {
    port: PORT,
    env: process.env.NODE_ENV || 'development'
  });
});
