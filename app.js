aconst express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Example route
app.get('/', (req, res) => {
    res.send('Hello World from GymPro5!');
});

// Example route for testing
app.get('/api', (req, res) => {
    res.json({ message: 'API is working!' });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Example route
app.get('/', (req, res) => {
    res.send('Hello World from GymPro5!');
});

// Example route for testing
app.get('/api', (req, res) => {
    res.json({ message: 'API is working!' });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
