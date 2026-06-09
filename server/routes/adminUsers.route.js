import express from 'express';
import verifyFirebaseToken from '../middleware/token.js';
import { getAdmin } from '../services/adminService.js';
import { getAllUsers } from '../services/userService.js';
import { getUserImages } from '../services/dentalImageService.js';

const router = express.Router();

// Middleware to verify the user is an admin
const verifyAdmin = async (req, res, next) => {
  try {
    const adminId = req.user.uid;
    await getAdmin(adminId);
    next();
  } catch (err) {
    console.error('Admin verification error:', err);
    return res.status(403).json({ error: 'Access denied: Admin privileges required' });
  }
};

router.use('/api/v1/users', verifyFirebaseToken, verifyAdmin);

// GET /api/v1/users - Get all users
router.get('/api/v1/users', async (req, res) => {
  try {
    const users = await getAllUsers();
    return res.status(200).json({ success: true, users });
  } catch (err) {
    console.error('Retrieve users error:', err);
    return res.status(500).json({ error: 'Failed to retrieve users' });
  }
});

// GET /api/v1/users/:userId/dental-images - Get a specific user's image history / results
router.get('/api/v1/users/:userId/dental-images', async (req, res) => {
  try {
    const images = await getUserImages(req.params.userId);
    return res.status(200).json({ success: true, data: images });
  } catch (error) {
    console.error('Fetch user history error:', error);
    return res.status(500).json({ error: 'Failed to retrieve user history' });
  }
});

export default router;
