import { db, admin } from '../config/config.js';

describe('Firebase Admin SDK Connection', () => {
  test('should initialize Firebase Admin SDK', () => {
    expect(admin).toBeDefined();
    expect(admin.apps.length).toBeGreaterThan(0);
  });

  test('should have FIREBASE_PROJECT_ID set in .env', () => {
    expect(process.env.FIREBASE_PROJECT_ID).toBeDefined();
  });

  test('should connect to Firestore with real read operation', async () => {
    expect(db).toBeDefined();
    
    // Actually try to read a document to verify real connection
    const testRef = db.collection('_connection_test').doc('test');
    const doc = await testRef.get();
    
    // If we reach here without error, connection works
    expect(doc).toBeDefined();
  });
});
