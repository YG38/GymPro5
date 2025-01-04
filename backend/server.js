require('dotenv').config(); // Load environment variables

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 1337;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

// User schema and model
const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    role: String
});

const User = mongoose.model('User', userSchema);

// Example route for user registration
app.post('/api/register', async (req, res) => {
    const { firstName, lastName, email, password, role } = req.body;

    const user = new User({ firstName, lastName, email, password, role });
    await user.save();

    res.json({ message: 'Registration successful' });
});

// Example route for user login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });

    if (!user) {
        return res.status(400).json({ message: 'Login failed' });
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    res.json({ message: 'Login successful', token });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});