// Health check route for the server
import express from 'express';

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

export default router;
