import { db, admin } from '../config/config.js';

describe('Firebase Admin SDK Connection', () => {
  test('should initialize Firebase Admin SDK', () => {
    expect(admin).toBeDefined();
    expect(admin.apps.length).toBeGreaterThan(0);
  });

  test('should have FIREBASE_PROJECT_ID set in .env', () => {
    expect(process.env.FIREBASE_PROJECT_ID).toBeDefined();
  });

  test('should connect to Firestore', async () => {
    expect(db).toBeDefined();
    
    // Try a simple read operation to verify connection
    const testRef = db.collection('_connection_test').doc('test');
    const doc = await testRef.get();
    
    // Just checking if we can query Firestore without errors
    expect(doc).toBeDefined();
  });

  test('should have admin access', async () => {
    // Try to create a test document (admin operation)
    const testRef = db.collection('_admin_test').doc('verify_' + Date.now());
    
    await testRef.set({ timestamp: new Date(), test: true });
    const doc = await testRef.get();
    
    expect(doc.exists).toBe(true);
    expect(doc.data().test).toBe(true);
    
    // Clean Up: Comment line below if you want to keep the test document for verification
    await testRef.delete();
  });
});
