# Dental Web Application Backend

Backend for the Dental Web Application, built with Node.js, Express, Firebase, and YOLOv8 following a 4-week accelerated development timeline on free-tier infrastructure.

## Architecture

The application uses a microservice architecture on Render:

1. **Node.js Backend** (main API server) - Handles authentication, data management, and orchestration
2. **ML Inference Service** (teammate-built) - Separate endpoint for YOLOv8 model inference
3. **Firebase** (external) - Authentication and database
4. **Cloudinary** (external, TBD) - Image storage

**Inference Flow**:
1. User uploads dental image → Stored in Cloudinary
2. Frontend calls Node.js `/api/diagnosis/create` with image URL
3. Node.js calls ML Inference endpoint (HTTP POST) with image
4. ML Service returns: plaqueDetected, plaqueLevel, oralHealthStatus, confidenceScore
5. Node.js stores results in Firestore diagnosis_results collection

## Project Structure

```
public/                                 # Mock frontend for local API testing purposes
schema.dbml                             # Database Entity Relationship Diagram (ERD)
server/
├── app.js                              # Main Express app (orchestrates routes and middleware)
├── server.js                           # Entry point to start the server
│
├── config/
│   └── config.js                       # Firebase Admin SDK initialization (uses env vars)
│
├── routes/                             # API route handlers
│   ├── health.js                       # Health check endpoint
│   ├── auth.js                         # User authentication (signup/login)
│   └── adminAuth.js                    # Admin authentication (signup/login)
│
├── middleware/                         # Custom middleware for auth, error handling
│   ├── auth.js                         # Firebase token verification middleware
│   └── errorHandler.js                 # Centralized error handling middleware
│
├── schemas/                            # Data validation schemas (Zod)
│   ├── userSchema.js                   # User signup, login, and update validation
│   ├── adminSchema.js                  # Admin signup, login, and update validation
│   ├── dentalImageSchema.js            # Dental image validation
│   ├── diagnosisResultSchema.js        # Diagnosis result validation
│   └── appointmentSchema.js            # Appointment validation
│
├── services/                           # Firestore operations
│   ├── userService.js                  # User CRUD and authentication operations
│   ├── adminService.js                 # Admin CRUD and authentication operations
│   ├── dentalImageService.js           # Dental image CRUD operations
│   └── diagnosisResultService.js       # Diagnosis result CRUD operations
│
└── tests/                              # Test suite (ESM)
    ├── firebase_tests/
    │   ├── firebaseConnection.test.js  # Firebase Admin SDK connection tests
    │   └── firestoreRules.test.js      # Firestore security rules tests
    ├── middleware_tests/
    │   ├── errorHandler.test.js        # Error handling middleware tests
    │   └── token.test.js               # Auth token verification tests
    ├── routes_tests/
    │   ├── healthRoute.test.js         # Health check endpoint tests
    │   ├── authRoutes.test.js          # User authentication routes tests
    │   └── adminAuthRoutes.test.js     # Admin authentication routes tests
    └── schema_tests/
        ├── userService.test.js         # User schema validation tests
        ├── adminService.test.js        # Admin schema validation tests
        ├── dentalImageSchema.test.js   # Dental image schema tests
        ├── diagnosisResultSchema.test.js # Diagnosis result schema tests
        └── appointmentSchema.test.js   # Appointment schema tests
```

## Setup Instructions

### 1. Install dependencies
```sh
npm install
```
This installs: firebase-admin, firebase, dotenv, zod, cors, express, jest, and supertest.

### 2. Firebase Credentials

Get these from Firebase Console > Settings > Service Accounts > Generate New Private Key:
- `projectId`
- `clientEmail`
- `privateKey` (the full private key with embedded `\n` characters)

### 3. Environment Variables

Create `.env` at the root with:
```
# Firebase Admin SDK
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n

# Firebase Web SDK (client)
FIREBASE_API_KEY=your-web-api-key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your-sender-id
FIREBASE_APP_ID=your-app-id

NODE_ENV=development
PORT=3000
```

Note: The private key will have literal `\n` characters that get properly escaped by the `.replace(/\\n/g, '\n')` logic in config.js.

### 4. Run the server
```sh
npm run dev
```

### 5. Run tests
```sh
# Run all tests
npm test

# Run specific test file
npm test -- authRoutes.test.js
npm test -- adminAuthRoutes.test.js

# Run by test type
npm test -- schema_tests/
npm test -- routes_tests/
npm test -- firebase_tests/
npm test -- middleware_tests/
```

## Testing

### Test Suite (104 tests, all passing)

**Schema Tests (97 tests):**
- `userService.test.js` - 20 tests for user signup, login, and update validation
- `adminService.test.js` - 19 tests for admin signup, login, and update validation
- `dentalImageSchema.test.js` - 11 tests for dental image creation and updates
- `diagnosisResultSchema.test.js` - 24 tests for diagnosis results with enum validation
- `appointmentSchema.test.js` - 23 tests for appointment scheduling with date/time validation

**Middleware Tests:**
- `errorHandler.test.js` - Tests error formatting and status codes
- `token.test.js` - Tests Firebase token verification and edge cases

**Route Tests:**
- `healthRoute.test.js` - Tests health check endpoint
- `authRoutes.test.js` - Tests for user authentication validation and error handling
- `adminAuthRoutes.test.js` - Tests for admin authentication validation and error handling

**Firebase Tests (2 tests):**
- `firebaseConnection.test.js` - Verifies Firebase Admin SDK connection
- `firestoreRules.test.js` - Tests Firestore security rules (deny unauthenticated, allow admin SDK)

### Test Coverage

- **Input Validation**: Email format, password length, required fields
- **Schema Validation**: All Zod schemas tested for valid and invalid data
- **Enum Validation**: Plaque levels, oral health status, appointment status
- **Firebase Integration**: Connection and security rule verification
- **Error Handling**: Proper HTTP status codes and error messages

## Module System

This project uses ES Modules (ESM) for modern JavaScript standards:
- All files use `import`/`export` syntax
- `package.json` has `"type": "module"` enabled
- Jest configured to work with ESM
- All import paths require `.js` extensions
- Firebase Admin SDK exports: `db`, `auth`, `admin`

## Database Schema (Firestore)

Collections:
- **users**: User profiles and account information (Firebase Auth linked)
- **admins**: Admin accounts (Firebase Auth linked)
- **dental_images**: Images uploaded by users
- **diagnosis_results**: AI diagnosis results linked to images
- **admin_view_results**: Admin diagnosis reviews
- **appointments**: Appointment bookings (pending implementation)

Data validation handled by Zod schemas before Firestore operations.

## Authentication

User and admin authentication uses Firebase Authentication with email/password. The backend verifies Firebase ID tokens using the Admin SDK.

### User Signup
```
POST /api/auth/signup
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePassword123"
}

Response (201):
{
  "success": true,
  "uid": "...",
  "user": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com"
  }
}
```

### User Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePassword123"
}

Response (200):
{
  "success": true,
  "token": "...",
  "user": {
    "uid": "...",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com"
  }
}
```

### Admin Signup and Login
Same as user authentication but at `/api/admin/auth/signup` and `/api/admin/auth/login`.

## Architecture Guardrails

- No local disk storage: Images handled as in-memory buffers, streamed to external storage
- No serverless backend conversions: Image uploads handled on Render, not Vercel
- Token verification mandatory: All protected endpoints verify Firebase ID tokens
- NoSQL denormalization: Frequently-accessed data embedded to keep reads fast
- ES Modules only: All files use import/export syntax
- Zod gateway validation: All request payloads validated before Firestore operations

## Key Technologies

- Node.js 18+ with ES Modules
- Express 5.2.1
- Firebase Admin SDK 13.10.0 (Firestore, Auth)
- Firebase Web SDK (client-side auth)
- Zod 4.4.3 (data validation)
- Jest 30.4 + Supertest 7.2 (testing)
- YOLOv8 (via separate inference endpoint hosted on Render)

## Current Implementation Status

### Completed
- Express server with modular structure
- Firebase Admin SDK configured for Render deployment
- Health check endpoint
- User and admin authentication (signup/login)
- Zod schemas for all data models
- Service layer for CRUD operations
- Firebase token verification middleware
- Comprehensive test suite (104 tests)
- Error handling middleware

### Pending
- Image upload endpoints (awaiting Cloudinary setup)
- ML Inference endpoint integration (awaiting teammate's endpoint URL)
- Roboflow API integration with Node.js (deferred to ML service)
- Dental image CRUD endpoints
- Appointments API endpoints
- Admin dashboard endpoints
- Email verification flow
- Password reset flow

## Deployment

Server is configured to run on Render free tier with the following constraints:
- 512MB RAM limit
- Must handle all image operations in-memory
- Uses Firebase Firestore as primary database
- Calls teammate's ML Inference endpoint via HTTP for diagnosis predictions

All environment variables must be set in the deployment platform, including the ML Inference endpoint URL once available.

## Next Steps

1. Complete image upload implementation (Cloudinary or Firebase Storage)
2. Implement protected endpoints with auth middleware
3. Integrate Roboflow API for diagnosis results
4. Add appointments management endpoints
5. Implement admin dashboard endpoints

