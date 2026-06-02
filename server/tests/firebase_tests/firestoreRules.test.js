import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { db as adminDb } from '../../config/firebase.js';

// client config for testing Firestore rules
const firebaseClientConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

describe('Firestore Security Rules', () => {
  test('should DENY unauthenticated client', async () => {
    // Use unique app name to avoid "App already exists" error
    const clientApp = initializeApp(firebaseClientConfig, 'client-' + Date.now());
    const clientDb = getFirestore(clientApp);

    try {
      await setDoc(doc(clientDb, 'users', 'test'), { name: 'Test' });
      expect(true).toBe(false);
    } catch (error) {
      expect(error.code).toBe('permission-denied');
    }
  });

  test('should ALLOW admin SDK CRUD', async () => {
    const testId = 'test-' + Date.now();

    await adminDb.collection('users').doc(testId).set({ name: 'Test' });
    const snap = await adminDb.collection('users').doc(testId).get();
    expect(snap.exists).toBe(true);

    await adminDb.collection('users').doc(testId).update({ name: 'Updated' });
    await adminDb.collection('users').doc(testId).delete();
  });
});