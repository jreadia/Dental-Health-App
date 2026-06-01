// Register route for the server
import { userCreateSchema } from '../schemas/userSchema.js';
import express from 'express';

const router = express.Router();

router.get('/api/registerUser', (req, res) => {
  res.json({ message: 'Register endpoint is working' });
});

router.post('/api/registerUser', (req, res) => {
  const registerUser = userCreateSchema.safeParse(req.body);
  if (!registerUser.success) {
    return res.status(400).json({
      error: 'Invalid Input', details: registerUser.error.errors
    });
  };

  const { email } = registerUser.data;
  res.json({ message: `User with email ${email} registered successfully` });
});

export default router;