import { db } from '../config/firebase.js';

// Create a new diagnosis result
const createDiagnosisResult = async (resultData) => {
  try {
    const docRef = await db.collection('diagnosis_results').add({
      imageId: resultData.imageId,
      plaqueDetected: resultData.plaqueDetected,
      plaqueLevel: resultData.plaqueLevel,
      oralHealthStatus: resultData.oralHealthStatus,
      confidenceScore: resultData.confidenceScore,
      createdAt: new Date(),
    });

    return { success: true, resultId: docRef.id };
  } catch (error) {
    throw new Error(`Failed to create diagnosis result: ${error.message}`, { cause: error });
  }
};

// Get diagnosis result by ID
const getDiagnosisResult = async (resultId) => {
  try {
    const doc = await db.collection('diagnosis_results').doc(resultId).get();
    if (!doc.exists) {
      throw new Error('Diagnosis result not found');
    }
    return { resultId: doc.id, ...doc.data() };
  } catch (error) {
    throw new Error(`Failed to retrieve diagnosis result: ${error.message}`, { cause: error });
  }
};

// Get diagnosis result by image ID
const getDiagnosisByImageId = async (imageId) => {
  try {
    const snapshot = await db.collection('diagnosis_results')
      .where('imageId', '==', imageId)
      .limit(1)
      .get();

    if (snapshot.empty) {
      throw new Error('Diagnosis result not found for this image');
    }

    const doc = snapshot.docs[0];
    return { resultId: doc.id, ...doc.data() };
  } catch (error) {
    throw new Error(`Failed to retrieve diagnosis result: ${error.message}`, { cause: error });
  }
};

// Update diagnosis result
const updateDiagnosisResult = async (resultId, resultData) => {
  try {
    await db.collection('diagnosis_results').doc(resultId).update(resultData);
    return { success: true, resultId };
  } catch (error) {
    throw new Error(`Failed to update diagnosis result: ${error.message}`, { cause: error });
  }
};

// Delete diagnosis result
const deleteDiagnosisResult = async (resultId) => {
  try {
    await db.collection('diagnosis_results').doc(resultId).delete();
    return { success: true, resultId };
  } catch (error) {
    throw new Error(`Failed to delete diagnosis result: ${error.message}`, { cause: error });
  }
};

export {
  createDiagnosisResult,
  getDiagnosisResult,
  getDiagnosisByImageId,
  updateDiagnosisResult,
  deleteDiagnosisResult,
};
