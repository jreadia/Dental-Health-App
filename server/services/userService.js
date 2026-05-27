const { db } = require('../config/config');

// Create a new user
const createUser = async (userId, userData) => {
  try {
    await db.collection('users').doc(userId).set({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      birthDate: new Date(userData.birthDate),
      sex: userData.sex,
      address: userData.address,
      createdAt: new Date(),
    });
    return { success: true, userId };
  } catch (error) {
    throw new Error(`Failed to create user: ${error.message}`);
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
    await db.collection('users').doc(userId).delete();
    return { success: true, userId };
  } catch (error) {
    throw new Error(`Failed to delete user: ${error.message}`);
  }
};

module.exports = {
  createUser,
  getUser,
  updateUser,
  deleteUser,
};
