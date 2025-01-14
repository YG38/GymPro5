const express = require('express');
const User = require('../models/User');
const Manager = require('../models/Manager');

const router = express.Router();

// Delete a user specific to manager's gym
router.delete('/delete-user/:userId', async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.userId);
    if (user) {
        res.status(200).json({ message: 'User deleted successfully!' });
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

module.exports = router;
