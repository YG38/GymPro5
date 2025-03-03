import { Router } from 'express';
import { findByIdAndDelete } from '../models/User.js';
import Manager from '../models/Manager.js';

const router = Router();

// Delete a user specific to manager's gym
router.delete('/delete-user/:userId', async (req, res) => {
    try {
        const user = await findByIdAndDelete(req.params.userId);
        if (user) {
            res.status(200).json({ message: 'User deleted successfully!' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
