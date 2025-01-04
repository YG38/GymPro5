const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');

// Register a new user
router.post('/register', register);

// Login a user
router.post('/login', login);

// Example of protected route
router.get('/protected', authMiddleware, (req, res) => {
    res.send('This is a protected route');
});

// Example of role-based route
router.get('/admin', authMiddleware, roleMiddleware(['admin']), (req, res) => {
    res.send('This is an admin route');
});

module.exports = router;