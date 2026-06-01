import { db, auth } from '../config/config.js';

// Signup: Create Firebase Auth user and store profile in Firestore
const signupUser = async (email, password, userData) => {
  try {
    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
    });

    const uid = userRecord.uid;

    // Store user profile in Firestore
    await db.collection('users').doc(uid).set({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email,
      createdAt: new Date(),
    });

    // Get Firebase ID token (return to client to use for authentication)
    // Note: Frontend will need to sign in and get token
    return { success: true, uid, email, firstName: userData.firstName, lastName: userData.lastName };
  } catch (error) {
    throw new Error(`Failed to sign up user: ${error.message}`);
  }
};

// Get user by ID
const getUser = async (userId) => {
  try {
    const doc = await db.collection('users').doc(userId).get();
    if (!doc.exists) {
      throw new Error('User not found');
    }
    return { userId: doc.id, ...doc.data() };
  } catch (error) {
    throw new Error(`Failed to retrieve user: ${error.message}`);
  }
};

// Update user
const updateUser = async (userId, userData) => {
  try {
    await db.collection('users').doc(userId).update(userData);
    return { success: true, userId };
  } catch (error) {
    throw new Error(`Failed to update user: ${error.message}`);
  }
};

// Delete user
const deleteUser = async (userId) => {
  try {
    // Delete from Firestore
    await db.collection('users').doc(userId).delete();

    // Delete from Firebase Auth
    await auth.deleteUser(userId);

    return { success: true, userId };
  } catch (error) {
    throw new Error(`Failed to delete user: ${error.message}`);
  }
};

export {
  signupUser,
  getUser,
  updateUser,
  deleteUser,
};

