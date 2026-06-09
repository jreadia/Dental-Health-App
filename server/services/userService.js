import { db, auth } from '../config/firebase.js';

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
      phoneNumber: userData.phoneNumber,
      address: userData.address,
      birthday: userData.birthday,
      email,
      createdAt: new Date(),
    });

    // Get Firebase ID token (return to client to use for authentication)
    // Note: Frontend will need to sign in and get token
    return { 
      success: true, 
      uid, 
      email, 
      firstName: userData.firstName, 
      lastName: userData.lastName,
      phoneNumber: userData.phoneNumber,
      address: userData.address,
      birthday: userData.birthday
    };
  } catch (error) {
    throw new Error(`Failed to sign up user: ${error.message}`, { cause: error });
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
    throw new Error(`Failed to retrieve user: ${error.message}`, { cause: error });
  }
};

// Get all users
const getAllUsers = async () => {
  try {
    const snapshot = await db.collection('users').get();
    const users = [];
    snapshot.forEach((doc) => {
      users.push({ userId: doc.id, ...doc.data() });
    });
    return users;
  } catch (error) {
    throw new Error(`Failed to retrieve users: ${error.message}`, { cause: error });
  }
};

// Update user
const updateUser = async (userId, userData) => {
  try {
    await db.collection('users').doc(userId).update(userData);
    return { success: true, userId };
  } catch (error) {
    throw new Error(`Failed to update user: ${error.message}`, { cause: error });
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
    throw new Error(`Failed to delete user: ${error.message}`, { cause: error });
  }
};

export {
  signupUser,
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
};

