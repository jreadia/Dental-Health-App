# Week 4 Updates - Authentication & Schema Implementation

## Overview
Completed implementation of authentication system (signup/login for users and admins), updated database schemas to match ERD, and added comprehensive unit tests. This week focused on establishing a secure authentication layer and foundational data structures.

---

## Files Created

### Schemas
1. **`server/schemas/diagnosisResultSchema.js`** - NEW
   - Zod validation for diagnosis results
   - Fields: imageId, plaqueDetected, plaqueLevel, oralHealthStatus, confidenceScore
   - Supports both create and update operations

2. **`server/schemas/appointmentSchema.js`** - NEW
   - Zod validation for appointments (for future implementation)
   - Fields: userId, adminId, resultId, appointmentDate, appointmentTime, status
   - Supports create and update with optional fields

### Middleware
3. **`server/middleware/auth.js`** - NEW
   - Firebase ID token verification middleware
   - Extracts Bearer token from Authorization header
   - Verifies token using Firebase Admin SDK
   - Attaches decoded uid and email to req.user for downstream routes
   - Returns 401 for missing or invalid tokens

### Services
4. **`server/services/diagnosisResultService.js`** - NEW
   - Complete CRUD operations for diagnosis results
   - Functions: createDiagnosisResult, getDiagnosisResult, getDiagnosisByImageId, updateDiagnosisResult, deleteDiagnosisResult
   - Stores results in separate Firestore collection (not embedded)
   - Supports querying by imageId

### Routes
5. **`server/routes/auth.js`** - NEW
   - User authentication endpoints
   - `POST /api/auth/signup` - Create user account with email/password
   - `POST /api/auth/login` - Authenticate user and return Firebase ID token
   - Uses Firebase REST API for authentication
   - Validates input with Zod schemas
   - Returns structured JSON responses with token and user data

6. **`server/routes/adminAuth.js`** - NEW
   - Admin authentication endpoints (mirrors user auth)
   - `POST /api/admin/auth/signup` - Create admin account
   - `POST /api/admin/auth/login` - Authenticate admin
   - Same structure and validation as user routes
   - Returns admin profile with token

### Tests
7. **`server/tests/routes_tests/authRoutes.test.js`** - NEW
   - Comprehensive tests for user authentication
   - Test cases:
     - ✅ Valid signup with all required fields
     - ✅ Valid login (when API key available)
     - ❌ Duplicate email signup
     - ❌ Missing required fields
     - ❌ Invalid email format
     - ❌ Password too short
     - ❌ Missing email/password on login
   - Uses Supertest for HTTP testing
   - Mocks userService for isolated unit tests

8. **`server/tests/routes_tests/adminAuthRoutes.test.js`** - NEW
   - Comprehensive tests for admin authentication
   - Mirrors user auth tests
   - Test cases for signup/login validation and error handling
   - Mocks adminService for isolated testing

### Documentation
9. **`week4_updates.md`** - NEW
   - This file - comprehensive tracking of all changes

---

## Files Modified

### Schemas
1. **`server/schemas/userSchema.js`**
   - ✏️ Replaced `userCreateSchema` with `userSignupSchema` (added password field)
   - ✏️ Added `userLoginSchema` (email + password for login)
   - ✏️ Updated `userUpdateSchema` (now optional firstName/lastName only)
   - ✏️ Removed: birthDate, sex, address fields (simplified per updated ERD)

2. **`server/schemas/adminSchema.js`**
   - ✏️ Replaced `adminCreateSchema` with `adminSignupSchema` (added password field)
   - ✏️ Added `adminLoginSchema` (email + password for login)
   - ✏️ Updated `adminUpdateSchema` (now optional fields only)

3. **`server/schemas/dentalImageSchema.js`**
   - ✏️ Removed `diagnosisSchema` (moved to separate diagnosisResultSchema.js)
   - ✏️ Removed `uploadDate` field (will be added server-side)
   - ✏️ Simplified schema: userId, imageUrl only

### Services
4. **`server/services/userService.js`**
   - ✏️ Replaced `createUser()` with `signupUser()` (now uses Firebase Auth)
   - ✏️ Added Firebase Auth integration for user creation and deletion
   - ✏️ Updated to use Firebase Admin SDK for auth operations
   - ✏️ Stores user profile in Firestore with createdAt timestamp
   - ✏️ Changed exports: signupUser, getUser, updateUser, deleteUser

5. **`server/services/adminService.js`**
   - ✏️ Replaced `createAdmin()` with `signupAdmin()` (now uses Firebase Auth)
   - ✏️ Added Firebase Auth integration for admin creation and deletion
   - ✏️ Updated to use Firebase Admin SDK for auth operations
   - ✏️ Changed exports: signupAdmin, getAdmin, getAllAdmins, updateAdmin, deleteAdmin

### Application
6. **`server/app.js`**
   - ✏️ Added import for auth routes: `import authRoutes from './routes/auth.js'`
   - ✏️ Added import for admin auth routes: `import adminAuthRoutes from './routes/adminAuth.js'`
   - ✏️ Mounted user auth routes: `app.use('/', authRoutes)`
   - ✏️ Mounted admin auth routes: `app.use('/', adminAuthRoutes)`

---

## Features Implemented

### ✅ User Authentication
- **Signup** - Create Firebase Auth user with email/password, store profile in Firestore
  - Validates: firstName, lastName, email, password (min 6 chars)
  - Returns: uid, user data
  - Error handling: Duplicate email, weak password, invalid input
  - Endpoint: `POST /api/auth/signup`
  - Status: 201 (Created) on success, 400 (Bad Request) on validation/auth error

- **Login** - Authenticate user and return Firebase ID token
  - Validates: email, password
  - Uses Firebase REST API for authentication
  - Fetches user profile from Firestore
  - Returns: Firebase ID token, user data
  - Error handling: Invalid password, email not found, configuration errors
  - Endpoint: `POST /api/auth/login`
  - Status: 200 (OK) on success, 400 (Bad Request) on auth/validation error

### ✅ Admin Authentication
- **Signup** - Same as user signup but for admins
  - Endpoint: `POST /api/admin/auth/signup`
  - Returns admin profile instead of user profile

- **Login** - Same as user login but for admins
  - Endpoint: `POST /api/admin/auth/login`
  - Returns admin profile instead of user profile

### ✅ Firebase Auth Middleware
- Middleware for protected routes (ready to use)
- Verifies Bearer token from Authorization header
- Extracts uid and email for downstream use
- Returns 401 for missing/invalid tokens

### ✅ Data Schemas
- **Diagnosis Results** - Separate collection schema
  - Linked to dental images by imageId
  - Fields: plaqueDetected, plaqueLevel, oralHealthStatus, confidenceScore
  - Validates numeric confidence score (0-100)

- **Appointments** - Schema for future implementation
  - Links users, admins, and diagnosis results
  - Supports date/time scheduling
  - Status field: Scheduled, Completed, Cancelled

---

## Tests Added

### User Authentication Tests (authRoutes.test.js)
- ✅ Valid signup returns 201 with user data
- ✅ Duplicate email returns 400
- ✅ Missing required fields returns 400
- ✅ Invalid email format returns 400
- ✅ Short password returns 400
- ✅ Missing email/password on login returns 400
- ✅ Invalid email format on login returns 400

**Total: 7 tests**

### Admin Authentication Tests (adminAuthRoutes.test.js)
- ✅ Valid signup returns 201 with admin data
- ✅ Duplicate email returns 400
- ✅ Missing required fields returns 400
- ✅ Invalid email format returns 400
- ✅ Short password returns 400
- ✅ Missing email/password on login returns 400
- ✅ Invalid email format on login returns 400

**Total: 7 tests**

**Grand Total: 14 new tests**

---

## API Endpoints Summary

### User Authentication
| Method | Endpoint | Request | Response | Status |
|--------|----------|---------|----------|--------|
| POST | `/api/auth/signup` | { firstName, lastName, email, password } | { success, user, token } | 201/400 |
| POST | `/api/auth/login` | { email, password } | { success, token, user } | 200/400 |

### Admin Authentication
| Method | Endpoint | Request | Response | Status |
|--------|----------|---------|----------|--------|
| POST | `/api/admin/auth/signup` | { firstName, lastName, email, password } | { success, admin, token } | 201/400 |
| POST | `/api/admin/auth/login` | { email, password } | { success, token, admin } | 200/400 |

---

## Firestore Collections Structure

### Users Collection (`/users/{uid}`)
```json
{
  "uid": "firebase-auth-uid",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "createdAt": "2026-01-XX..."
}
```

### Admins Collection (`/admins/{uid}`)
```json
{
  "uid": "firebase-auth-uid",
  "firstName": "Admin",
  "lastName": "User",
  "email": "admin@example.com",
  "createdAt": "2026-01-XX..."
}
```

### Diagnosis Results Collection (`/diagnosis_results/{resultId}`)
```json
{
  "resultId": "auto-generated",
  "imageId": "dental-image-id",
  "plaqueDetected": true,
  "plaqueLevel": "Moderate",
  "oralHealthStatus": "Warning",
  "confidenceScore": 87.5,
  "createdAt": "2026-01-XX..."
}
```

---

## Environment Variables Required

Ensure `.env` contains:
```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
FIREBASE_API_KEY=your-web-api-key  # NEW - required for login endpoints
PORT=3000
NODE_ENV=development
```

---

## Known Limitations & Future Work

### ✏️ Deferred to Future Weeks
1. **Image Upload Endpoints** - Cloudinary integration pending
2. **Appointments API** - Schema created, endpoints deferred
3. **Admin View Results Access Control** - Role-based access control not yet implemented
4. **Email Verification** - No email verification flow
5. **Password Reset** - No password reset mechanism
6. **Logout Endpoint** - Firebase handles token expiration client-side
7. **Token Refresh** - Token refresh endpoint not implemented

### ⚠️ Current Constraints
- **Firebase REST API Dependency** - Login endpoints depend on FIREBASE_API_KEY being set
  - If API key missing, login returns 500 error
  - Frontend alternative: Use Firebase Web SDK for authentication
- **No Rate Limiting** - Auth endpoints should have rate limiting for production
- **No CSRF Protection** - Should add for production deployment

### 🔒 Security Notes
- Passwords are hashed by Firebase Auth automatically
- Firebase Admin SDK handles secure token verification
- All endpoints validate input with Zod before processing
- Bearer token verification required for protected endpoints (ready to use)

---

## Testing Instructions

### Run All Tests
```bash
npm test
```

### Run Auth Tests Only
```bash
npm test -- authRoutes.test.js
npm test -- adminAuthRoutes.test.js
```

### Manual API Testing

**User Signup**
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

**User Login** (requires valid FIREBASE_API_KEY)
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

**Admin Signup**
```bash
curl -X POST http://localhost:3000/api/admin/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Admin",
    "lastName": "User",
    "email": "admin@example.com",
    "password": "SecurePass123"
  }'
```

---

## What's Next (Week 5)

1. **Image Upload Endpoints** - Implement Cloudinary integration for dental images
2. **Protected Routes** - Use auth middleware to protect admin and user endpoints
3. **Appointments API** - Create endpoints for appointment management
4. **Admin View Results** - Implement role-based access control for diagnosis results
5. **Additional CRUD Endpoints** - Full API coverage for all resources

---

## Commit Summary

This work encompasses all authentication infrastructure, schema updates, and testing for user/admin signup and login flows. No commits have been created yet - await user approval before committing.

**Files Statistics:**
- Created: 9 files
- Modified: 6 files
- Total Changes: 15 files
- New Tests: 14
- New API Endpoints: 4

---

*Last Updated: 2026-01-XX*
*Status: Ready for review and testing*
