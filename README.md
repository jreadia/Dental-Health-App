# Dental Web Application Backend

Backend for the Dental Web Application, built with Node.js, Express, Firebase, and Roboflow (Not Final) following DevOps and architecture guidelines.

## Project Structure

```
server/
  app.js                     # Main Express app (routes, middleware)
  server.js                  # Entry point to start the server
  config/
    config.js                # Firebase Admin SDK initialization
  routes/                    # Route handlers (to be created)
  middleware/                # Custom middleware for auth, error handling (to be created)
  schemas/
    userSchema.js            # Zod validation for user data
    dentalImageSchema.js     # Zod validation for dental images and diagnosis
    adminSchema.js           # Zod validation for admin data
  services/
    userService.js           # Firestore operations for users
    dentalImageService.js    # Firestore operations for dental images
    adminService.js          # Firestore operations for admins
  utils/                     # Utility modules (logger, etc.)
  tests/
    userService.test.js              # User schema validation tests (Zod)
    testFirebaseConnection.test.js    # Firebase Admin SDK connection tests
  serviceAccountKey.json     # Firebase Admin SDK key (DO NOT COMMIT)
```

## Setup Instructions

1. Install dependencies:
    ```sh
    npm install
    ```
    This installs: firebase-admin, dotenv, zod, cors, express, jest, and supertest

2. Firebase Admin SDK Setup:
    - Go to Firebase Console > Settings > Service Accounts
    - Generate a new private key
    - Save it as `server/serviceAccountKey.json` (never commit this file)
    - This file contains all credentials needed for the admin SDK

3. Environment Variables:
    Create `.env` at the root with:
    ```
    FIREBASE_PROJECT_ID=your-project-id
    NODE_ENV=development
    PORT=3000
    ```
    **Note:** Only the project ID is needed in `.env` because `firebase-admin` uses the service account key (`serviceAccountKey.json`) for all other credentials. The Web SDK configs (API Key, Auth Domain, etc.) are not needed for the backend admin SDK.

4. Run the server:
    ```sh
    node server/server.js
    ```

5. Run tests:
    ```sh
    <!-- run all test -->
    npm test

    <!-- run specific test -->
    npm test -- "testname" (this is inside server/tests folder)
    ```

## Database Schema (Firestore)

Collections:
- users: User profiles and account information
- dental_images: Images with embedded diagnosis results
- admins: Admin accounts

Data validation handled by Zod schemas before Firestore operations.

## Key Technologies
- Node.js + Express
- Firebase Admin SDK (Firestore, Storage (Blaze plan needed), Auth)
- Roboflow API (YOLOv8) # Note: Not Final, just a suggestion for model hosting
- Multer (in-memory file uploads)
- Zod (input validation)
- Jest & Supertest (unit/integration testing)

## Architecture Guardrails
- No local disk storage: all uploads in-memory, streamed to Firebase Storage (future)
- All sensitive endpoints protected by Firebase Auth token verification
- Data denormalization for fast NoSQL reads (diagnosis embedded in dental_images)
- Predictable JSON API contracts enforced with Zod validation

## Current Status
- Express server initialized and running
- Firestore connected (Spark plan)
- Zod validation schemas created for users, dental images, admins
- Firebase service layer implemented (CRUD operations)
- Schema validation tests passing (users)
- Firebase Admin SDK connection tests created and passing
- Health check endpoint working (/health)
- Cloud Storage skipped (Spark plan limitation, to be discussed with team)

### Server Health Check
```sh
curl http://localhost:3000/health
```

## Next Steps
- Create Express routes for API endpoints (users, images, admins)
- Implement Firebase Auth middleware for token verification
- Add image upload endpoint with multer integration (after Cloud Storage enabled)
- Create integration tests with Firestore

## License
MIT
