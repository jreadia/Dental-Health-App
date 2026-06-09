# Week 5 Updates: ML API Integration, Security & REST API Refactor

## Overview
This document serves as a comprehensive log of all recent architectural changes, including the initial machine learning (YOLOv8n) gatekeeper integration, the transition to secure HTTP-only cookies, full REST API standardization, and the implementation of complete Admin and User management routes.

---

## 1. Security, REST API Refactor & Admin Features (Latest Updates)

### Security & Authentication Migration
- **HTTP-Only Cookies**: Transitioned from sending the Firebase JWT token in the JSON response body to automatically setting it as an `httpOnly` cookie upon login. This vastly improves security against XSS attacks.
- **New Dependency**: Installed `cookie-parser` to handle incoming cookies.
- **Middleware Update**: Updated `server/middleware/token.js` to extract the JWT directly from `req.cookies.token`, falling back to the `Authorization` header only if the cookie is missing.
- **Logout Endpoints**: Created `POST /api/v1/auth/users/logout` and `POST /api/v1/auth/admins/logout` which securely clear the token cookie from the client's browser.

### Strict REST API Route Refactor
We undertook a comprehensive refactor to ensure all API routes adhere to strict REST naming conventions using the `/api/v1/` namespace:
- **Authentication**: `POST /api/v1/auth/users/register`, `/api/v1/auth/users/login`, `/api/v1/auth/users/logout` (and equivalent admin routes under `/api/v1/auth/admins/`).
- **Dental Images (User)**: `POST /api/v1/dental-images` (Upload) and `GET /api/v1/dental-images` (Fetch authenticated user's history).
- **Admin Management**: `GET`, `PUT`, `DELETE` under `/api/v1/admins`.
- **User Management (Admin View)**: `GET /api/v1/users` and `GET /api/v1/users/:userId/dental-images`.

### Feature Implementations & Testing
- **Efficiency Optimization**: Instead of maintaining a separate `diagnosis_results` collection, we are embedding the ML bounding box data directly inside the `dental_images` documents via the `mlResults` field. This significantly cuts down on Firestore read/write operations.
- **Admin Verification Middleware**: Implemented a `verifyAdmin` middleware to strictly enforce that the requester has a valid Admin document in Firestore.
- **Testing**: 110/110 tests are passing. All tests were updated to hit the new `/api/v1/` URIs.
- **Linting**: Fixed all ESLint warnings for a fully clean codebase.

### API Documentation & Swagger UI
- **Interactive Documentation**: Integrated `swagger-ui-express` to serve interactive API documentation at `/api-docs`.
- **Swagger JSON**: Created `server/swagger.json` mapping all endpoints to the OpenAPI 3.0 specification. Pre-populated inputs with valid dummy data matching our strict Zod schemas.
- **Root Redirect**: Updated the root route `/` to automatically redirect to `/api-docs` instead of serving the mock frontend.
- **Code Organization**: Extracted all Swagger serving and setup logic into a dedicated `server/routes/swagger.route.js` to keep `server/app.js` exceptionally clean.
---

## 2. ML Gatekeeper Architecture & Changed Files

### 1. `package.json`
- **Action**: Installed new dependencies.
- **Details**: Added `axios` and `form-data` to handle HTTP requests from the Node backend to the ML API.

### 2. `server/schemas/dentalImageSchema.js`
- **Action**: Updated the Zod schema for dental images.
- **Details**: Modified `dentalImageCreateSchema` to make the original `imageUrl` optional (for backwards compatibility), and added optional `originalImageUrl`, `annotatedImageUrl`, and `mlResults` fields to support the new ML outputs.

### 3. `server/services/dentalImageService.js`
- **Action**: Updated the Firestore service.
- **Details**: Updated the `createDentalImage` function to accept and save the newly generated `originalImageUrl`, `annotatedImageUrl`, and `mlResults` inside the Firestore document.

### 4. `server/mocks/mockML.route.js` [NEW FILE]
- **Action**: Created a local testing route.
- **Details**: Built a dummy endpoint (`/api/mock-ml/predict`) that simulates your teammate's YOLOv8n FastAPI server. It accepts an image upload and successfully returns the same image as a `base64` string alongside dummy bounding box JSON metadata specifically tailored for **calculus** detection.

### 5. `server/routes/dentalImages.route.js`
- **Action**: Heavily modified the upload gatekeeper logic.
- **Details**: 
  - Instead of streaming directly to Cloudinary, the file is intercepted and appended to a `FormData` object.
  - The image is forwarded via `axios.post` to the mock ML endpoint. *(Note: All complex "rejection" logic was removed. It blindly assumes the ML model processes the image and returns valid calculus data, to keep the architecture simple).*
  - Upon receiving the ML response, the `base64` annotated image is converted back into a buffer.
  - **Both** the original image buffer and annotated image buffer are uploaded to Cloudinary simultaneously using `Promise.all()`.
  - Both resulting URLs and the ML metadata are finally saved to Firestore.

### 6. `public/index.html`
- **Action**: Enhanced the mock frontend.
- **Details**: Updated the `handleImageUpload` function to automatically detect if the API returns `originalImageUrl` and `annotatedImageUrl`. If present, it visually renders both images side-by-side directly beneath the JSON response output box.

---

## 3. Schema & Code Quality Updates

### 1. `schema.dbml`
- **Action**: Updated database schemas.
- **Details**: 
  - Changed `plaque_detected` and `plaque_level` to `calculus_detected` and `calculus_amount` (int) in `diagnosis_results`. Removed `confidence_score`.
  - Added `phone_number`, `address`, and `birthday` to the `users` table.

### 2. Diagnosis Result Refactoring
- **Action**: Updated schemas, services, and tests.
- **Details**: Refactored `diagnosisResultSchema.js`, `diagnosisResultService.js`, and `dentalImageService.js` to use `calculusAmount` (integer validation) instead of string enums. Fully rewrote `diagnosisResultSchema.test.js` to assert number boundaries.

### 3. User Registration Fields
- **Action**: Added new demographic fields.
- **Details**: Updated `userSchema.js`, `userService.js`, and `userAuth.route.js` to require `phoneNumber`, `address`, and `birthday` during user signup. Validated with updated tests.
