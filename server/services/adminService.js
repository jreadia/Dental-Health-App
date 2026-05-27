import { db } from '../config/config.js';

// Create a new admin
const createAdmin = async (adminId, adminData) => {
  try {
    await db.collection('admins').doc(adminId).set({
      firstName: adminData.firstName,
      lastName: adminData.lastName,
      email: adminData.email,
      createdAt: new Date(),
    });
    return { success: true, adminId };
  } catch (error) {
    throw new Error(`Failed to create admin: ${error.message}`);
  }
};

// Get admin by ID
const getAdmin = async (adminId) => {
  try {
    const doc = await db.collection('admins').doc(adminId).get();
    if (!doc.exists) {
      throw new Error('Admin not found');
    }
    return { adminId: doc.id, ...doc.data() };
  } catch (error) {
    throw new Error(`Failed to retrieve admin: ${error.message}`);
  }
};

// Get all admins
const getAllAdmins = async () => {
  try {
    const snapshot = await db.collection('admins').get();
    const admins = [];
    snapshot.forEach((doc) => {
      admins.push({ adminId: doc.id, ...doc.data() });
    });
    return admins;
  } catch (error) {
    throw new Error(`Failed to retrieve admins: ${error.message}`);
  }
};

// Update admin
const updateAdmin = async (adminId, adminData) => {
  try {
    await db.collection('admins').doc(adminId).update(adminData);
    return { success: true, adminId };
  } catch (error) {
    throw new Error(`Failed to update admin: ${error.message}`);
  }
};

// Delete admin
const deleteAdmin = async (adminId) => {
  try {
    await db.collection('admins').doc(adminId).delete();
    return { success: true, adminId };
  } catch (error) {
    throw new Error(`Failed to delete admin: ${error.message}`);
  }
};

export {
  createAdmin,
  getAdmin,
  getAllAdmins,
  updateAdmin,
  deleteAdmin,
};
