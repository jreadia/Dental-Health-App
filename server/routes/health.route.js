// Health check route for the server
import express from 'express';

const router = express.Router();

router.get('/api/health', (req, res) => {
  res.json({ message: 'Server is healthy' });
});

export default router;
