# Week 5 Updates: ML API Integration & Gatekeeper Architecture

## Overview
This week, we successfully integrated the initial architecture for the machine learning (YOLOv8n) gatekeeper. The system is designed to intercept user image uploads, forward them to the ML model, and then upload both the original and annotated images to Cloudinary while saving all metadata to Firestore in a single write. 

To test this without the actual ML model being finished, a local "Mock ML" route was also implemented.

---

## Changed Files & Detailed Modifications

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

### 5. `server/app.js`
- **Action**: Registered the mock route.
- **Details**: Imported `mockMLRoutes` from `./mocks/mockML.route.js` and registered it with `app.use(mockMLRoutes)`.

### 6. `server/routes/dentalImages.route.js`
- **Action**: Heavily modified the upload gatekeeper logic.
- **Details**: 
  - Instead of streaming directly to Cloudinary, the file is intercepted and appended to a `FormData` object.
  - The image is forwarded via `axios.post` to the mock ML endpoint. *(Note: All complex "rejection" logic was removed. It blindly assumes the ML model processes the image and returns valid calculus data, to keep the architecture simple).*
  - Upon receiving the ML response, the `base64` annotated image is converted back into a buffer.
  - **Both** the original image buffer and annotated image buffer are uploaded to Cloudinary simultaneously using `Promise.all()`.
  - Both resulting URLs and the ML metadata are finally saved to Firestore.

### 7. `server/tests/routes_tests/dentalImagesRoutes.test.js`
- **Action**: Fixed failing tests.
- **Details**: Added a mock for `axios` using `jest.unstable_mockModule` so that the local tests do not actually attempt to hit the network. Updated the assertions to expect 2 Cloudinary uploads and expect the new `originalImageUrl` and `annotatedImageUrl` fields in the response.

### 8. `server/tests/schema_tests/dentalImageSchema.test.js`
- **Action**: Fixed failing tests.
- **Details**: Removed the `should reject missing imageUrl` test because the `imageUrl` field is now safely marked as `.optional()` in the schema.

### 9. `public/index.html`
- **Action**: Enhanced the mock frontend.
- **Details**: Updated the `handleImageUpload` function to automatically detect if the API returns `originalImageUrl` and `annotatedImageUrl`. If present, it visually renders both images side-by-side directly beneath the JSON response output box, eliminating the need to use Postman to visually verify the upload.

---

## Recent Schema & Code Quality Updates

### 10. `schema.dbml`
- **Action**: Updated database schemas.
- **Details**: 
  - Changed `plaque_detected` and `plaque_level` to `calculus_detected` and `calculus_amount` (int) in `diagnosis_results`. Removed `confidence_score`.
  - Added `phone_number`, `address`, and `birthday` to the `users` table.

### 11. Linting & Code Quality
- **Action**: Installed and configured ESLint.
- **Details**: Created `eslint.config.js` and added a `lint` script to `package.json` to enforce code quality. All code passes linting.

### 12. Diagnosis Result Refactoring
- **Action**: Updated schemas, services, and tests.
- **Details**: Refactored `diagnosisResultSchema.js`, `diagnosisResultService.js`, and `dentalImageService.js` to use `calculusAmount` (integer validation) instead of string enums. Fully rewrote `diagnosisResultSchema.test.js` to assert number boundaries.

### 13. User Registration Fields
- **Action**: Added new demographic fields.
- **Details**: Updated `userSchema.js`, `userService.js`, and `userAuth.route.js` to require `phoneNumber`, `address`, and `birthday` during user signup. Validated with updated tests.

---

## How to Revert
If you need to revert these changes, you can:
1. Run `git checkout .` if you have not committed yet, OR find the previous commit and run `git revert HEAD` or `git reset --hard HEAD~1` depending on your git history.
2. Manually undo the changes outlined above, specifically restoring `dentalImages.route.js` to its original direct-Cloudinary-upload state and deleting the `server/mocks/` directory.
