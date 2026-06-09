// updated to be compatible with Render's ESM environment
import 'dotenv/config.js';
import admin from 'firebase-admin';

// handle multiline private key for Render's environment variables
const privateKey = process.env.FIREBASE_PRIVATE_KEY 
  ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') 
  : undefined;

// initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
  });
}

// export db and auth for use in other modules
export const db = admin.firestore();
export const auth = admin.auth();
export { admin };