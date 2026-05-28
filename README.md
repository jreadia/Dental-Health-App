# Dental Web Application Backend

Backend for the Dental Web Application, built with Node.js, Express, Firebase, and Roboflow (Not Final) following DevOps and architecture guidelines.

## Project Structure

```
server/
├── app.js                              # Main Express app (orchestrates routes and middleware)
├── server.js                           # Entry point to start the server
│
├── config/
│   └── config.js                       # Firebase Admin SDK initialization (uses env vars)
│
├── routes/                             # API route handlers
│   └── health.js                       # Health check endpoint
│
├── middleware/                         # Custom middleware for auth, error handling
│   ├── auth.js                         # Firebase token verification middleware (empty for now)
│   └── errorHandler.js                 # Centralized error handling middleware
│
├── schemas/                            # Data validation schemas (Zod)
│   ├── userSchema.js                   # Zod validation for user data
│   ├── dentalImageSchema.js            # Zod validation for dental images and diagnosis
│   └── adminSchema.js                  # Zod validation for admin data
│
├── services/                           # Firestore operations
│   ├── userService.js                  # User CRUD operations
│   ├── dentalImageService.js           # Dental image CRUD operations
│   └── adminService.js                 # Admin CRUD operations
│
├── tests/                              # Test suite (ESM)
    ├── userService.test.js             # User schema validation tests (Zod)
    ├── firebaseConnection.test.js      # Firebase Admin SDK connection tests
    └── firestoreRules.test.js          # Firestore security rules & CRUD tests

```

## Setup Instructions

1. Install dependencies:
    ```sh
    npm install
    ```
    This installs: firebase-admin, firebase, dotenv, zod, cors, express, jest, and supertest

2. Firebase Credentials:
    Get these from Firebase Console > Settings > Service Accounts > Generate New Private Key:
    - `projectId`
    - `clientEmail` 
    - `privateKey` (the full private key with embedded `\n` characters)

3. Environment Variables:
    Create `.env` at the root with:
    ```
    # firebase admin SDK
    FIREBASE_PROJECT_ID=your-project-id
    FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
    FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
    
    # firebase web SDK (client)
    FIREBASE_API_KEY=your-web-api-key
    FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
    FIREBASE_STORAGE_BUCKET=your-project.appspot.com
    FIREBASE_MESSAGING_SENDER_ID=your-sender-id
    FIREBASE_APP_ID=your-app-id
    
    NODE_ENV=development
    PORT=3000
    ```
    **Note:** All Firebase credentials use environment variables for production deployment (e.g., Render). The private key will have literal `\n` characters that get properly escaped by the `.replace(/\\n/g, '\n')` logic in config.js.

4. Run the server:
    ```sh
    npm run dev
    ```

5. Run tests:
    ```sh
    # Run all tests
    npm test

    # Run specific test
    npm test -- userService.test.js
    npm test -- firebaseConnection.test.js
    npm test -- firestoreRules.test.js
    ```

## Module System

This project uses **ES Modules (ESM)** for modern JavaScript standards:
- All files use `import`/`export` syntax
- `package.json` has `"type": "module"` enabled
- Jest configured to work with ESM via `jest.config.js`
- All import paths require `.js` extensions
- Firebase Admin SDK exports: `db`, `auth`, `admin`

## Test Structure

- **userService.test.js** - Zod schema validation for user data
- **firebaseConnection.test.js** - Verifies actual Firestore connection with read operation
- **firestoreRules.test.js** - Tests Firestore security rules:
  - Verifies unauthenticated clients are DENIED (client SDK)
  - Verifies admin SDK can perform CRUD operations

## Database Schema (Firestore)

Collections:
- **users**: User profiles and account information
- **dental_images**: Images with embedded diagnosis results
- **admins**: Admin accounts

Data validation handled by Zod schemas before Firestore operations.

## Key Technologies
- Node.js + Express.js
- Firebase Admin SDK (Firestore, Auth)
- Firebase Web SDK (for client-side testing)
- Roboflow API (YOLOv8) — Not Final, suggestion for model hosting
- Multer (in-memory file uploads)
- Zod (data validation)
- Jest & Supertest (testing)
- ES Modules (ESM)

## Architecture Guardrails
- No local disk storage: all uploads in-memory, streamed to Firebase Storage (future)
- All sensitive endpoints protected by Firebase Auth token verification
- Data denormalization for fast NoSQL reads (diagnosis embedded in dental_images)
- Predictable JSON API contracts enforced with Zod validation
- Firestore security rules: deny all unauthenticated access (frontend users blocked, admin SDK allowed)

## Current Status

**Core Infrastructure**
- Express server initialized with modular route and middleware structure
- Health check endpoint in `routes/health.js` and mounted in `app.js`
- Error handling middleware implemented in `middleware/errorHandler.js`

**Database & Configuration**
- Firestore connected (Spark plan)
- Config uses environment variables for Render deployment
- Firebase Admin SDK initialized with initialization guard

**Data Validation & Services**
- Zod validation schemas created for users, dental images, admins
- Firebase service layer implemented (CRUD operations for users, dental images, admins)

**Testing**
- Schema validation tests passing (users)
- Firebase Admin SDK connection tests passing
- Firestore security rules tests passing (denies unauthenticated, allows admin SDK)

**Module System**
- Migrated to ES Modules (ESM) with proper Jest configuration

**Pending**
- Cloud Storage (Spark plan limitation, to be discussed with team)

### Server Health Check
```sh
curl http://localhost:3000/health
```

## Next Steps
- Create Express routes for API endpoints (users, images, admins)
- Implement Firebase Auth middleware for token verification
- Add image upload endpoint with multer integration (after Cloud Storage enabled)
- Expand integration tests for CRUD endpoints

## License
MIT
