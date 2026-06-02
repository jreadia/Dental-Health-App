import express from 'express';
import { userSignupSchema, userLoginSchema } from '../schemas/userSchema.js';
import { signupUser, getUser } from '../services/userService.js';

const router = express.Router();

// POST /api/auth/signup - User signup
router.post('/api/auth/signup', async (req, res) => {
  try {
    const validated = userSignupSchema.safeParse(req.body);
    if (!validated.success) {
      return res.status(400).json({
        error: 'Invalid Input',
        details: validated.error.errors,
      });
    }

    const { firstName, lastName, email, password } = validated.data;

    const result = await signupUser(email, password, { firstName, lastName });

    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: {
        uid: result.uid,
        firstName: result.firstName,
        lastName: result.lastName,
        email: result.email,
      },
    });
  } catch (error) {
    const errorMessage = error.message.toLowerCase();

    if (errorMessage.includes('email-already-exists')) {
      return res.status(400).json({ error: 'Email already registered', details: error.message });
    }

    if (errorMessage.includes('password')) {
      return res.status(400).json({ error: 'Invalid password', details: error.message });
    }

    return res.status(500).json({ error: 'Signup failed', details: error.message });
  }
});

// POST /api/auth/login - User login
router.post('/api/auth/login', async (req, res) => {
  try {
    const validated = userLoginSchema.safeParse(req.body);
    if (!validated.success) {
      return res.status(400).json({
        error: 'Invalid Input',
        details: validated.error.errors,
      });
    }

    const { email, password } = validated.data;

    // Use Firebase REST API for authentication
    const firebaseWebApiKey = process.env.FIREBASE_API_KEY;
    if (!firebaseWebApiKey) {
      return res.status(500).json({ error: 'Firebase configuration error' });
    }

    const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + firebaseWebApiKey, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const firebaseError = data.error?.message;

      if (firebaseError === 'INVALID_PASSWORD') {
        return res.status(400).json({ error: 'Invalid password' });
      }
      if (firebaseError === 'EMAIL_NOT_FOUND') {
        return res.status(400).json({ error: 'Email not found' });
      }

      return res.status(400).json({ error: 'Login failed', details: firebaseError });
    }

    const { idToken, localId: uid } = data;

    // Fetch user profile from Firestore
    const userProfile = await getUser(uid);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token: idToken,
      user: {
        uid,
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        email: userProfile.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: 'Login failed', details: error.message });
  }
});

export default router;
