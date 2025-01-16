// Import necessary modules
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
app.use('/auth', (req, res) => {
    res.json({ message: 'Authentication routes will be implemented here' });
  });
// Middleware to parse JSON
app.use(express.json());
app.use(cors());
// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB successfully');

    // Start the server only after successful MongoDB connection
    app.listen(5000, () => {
      console.log('Server is running on http://localhost:5000');
    });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

// Sample route for testing
app.get('/', (req, res) => {
  res.send('Welcome to GymPro5 API');
});

// Define other routes (Example: User route)
app.get('/users', (req, res) => {
  res.json({ message: 'This is the users route' });
});

// Error handling for undefined routes (404)
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});
