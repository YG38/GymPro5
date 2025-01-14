import { Router } from 'express';
import { findByIdAndDelete } from '../models/User';
import Manager from '../models/Manager';

const router = Router();

// Delete a user specific to manager's gym
router.delete('/delete-user/:userId', async (req, res) => {
    const user = await findByIdAndDelete(req.params.userId);
    if (user) {
        res.status(200).json({ message: 'User deleted successfully!' });
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

export default router;
