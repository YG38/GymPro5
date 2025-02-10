import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import gymRoutes from './routes/gym.js';
import authRoutes from './routes/auth.js';
import authWebRoutes from './routes/auth-web.js';

// Initialize express app
const app = express();

// Load environment variables
dotenv.config();

// Enhanced CORS Configuration
const allowedOrigins = [
  "http://gym-pro5.vercel.app",
  "http://localhost:5173",
  "http://192.168.100.10:5173", // Your local IP
  "http://127.0.0.1:5173"
];

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enhanced logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/auth-web', authWebRoutes);
app.use('/api/gyms', gymRoutes); // Changed to plural for REST consistency

// Health Check Endpoint
app.get('/health-check', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    server: `192.168.100.10:${process.env.PORT || 5000}`
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint not found' });
});

// Error Handling
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.stack}`);
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'development' 
      ? err.message 
      : 'Internal server error'
  });
});

// Server Configuration
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0'; // Allow external connections

app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running at:`);
  console.log(`🔗 Local:  http://localhost:${PORT}`);
  console.log(`🌐 Network: http://192.168.100.10:${PORT}`);
});