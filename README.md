# Dental Health App Backend

Backend for the Dental Web Application, built with Node.js, Express, Firebase, and YOLOv8 following an accelerated development timeline on free-tier infrastructure.

## Architecture

The application uses a microservice architecture built for Render:

1. **Node.js Backend** (main API server) - Handles authentication, data management, and orchestration.
2. **ML Inference Service** (teammate-built) - Separate endpoint for YOLOv8 model inference. (Currently using a local dummy `/api/mock-ml/predict` endpoint for development).
3. **Firebase** (external) - Authentication and Firestore database.
4. **Cloudinary** (external) - Image storage for original and annotated dental images.

**Inference Flow**:
1. User uploads dental image via `multipart/form-data`.
2. Backend intercepts file, sends it to ML Inference endpoint.
3. ML Service returns base64 annotated image and bounding box metadata (e.g., calculus detected).
4. Node.js uploads both original and annotated images to Cloudinary simultaneously.
5. Node.js embeds the ML results into a `dental_images` Firestore document linked to the user.

## Project Structure

```text
schema.dbml                             # Database Entity Relationship Diagram (ERD)
API_DOCUMENTATION.md                    # Static reference for frontend team
week5_updates.md                        # Changelog for latest architecture changes
server/
├── app.js                              # Main Express app (orchestrates routes and middleware)
├── server.js                           # Entry point to start the server
├── swagger.json                        # OpenAPI 3.0 specification file
│
├── config/
│   ├── firebase.js                     # Firebase Admin SDK initialization
│   └── cloudinary.js                   # Cloudinary configuration
│
├── routes/                             # Strict REST API route handlers (/api/v1/...)
│   ├── swagger.route.js                # Serves Swagger UI and handles root redirect
│   ├── health.route.js                 # Health check endpoint
│   ├── userAuth.route.js               # User authentication (signup/login/logout)
│   ├── adminAuth.route.js              # Admin authentication (signup/login/logout)
│   ├── adminManagement.route.js        # Admin management (GET, PUT, DELETE)
│   ├── adminUsers.route.js             # User lookup for Admins
│   └── dentalImages.route.js           # Image upload and history fetch endpoints
│
├── middleware/                         
│   ├── token.js                        # Validates httpOnly JWT cookies
│   ├── adminAuth.js                    # Ensures user is an authorized admin
│   ├── errorHandler.js                 # Centralized error handling
│   └── upload.js                       # Multer memory storage
│
├── schemas/                            # Zod Data validation
│   └── [various schema files]          
│
├── services/                           # Firestore operations
│   └── [various service files]         
│
└── tests/                              # Comprehensive Jest test suite
```

## Setup Instructions

### 1. Install dependencies
```sh
npm install
```

### 2. Environment Variables
Create `.env` at the root with your Firebase Admin, Firebase Client, and Cloudinary credentials:
```text
# Firebase Admin SDK
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Firebase Web SDK (client)
FIREBASE_API_KEY=your-web-api-key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your-sender-id
FIREBASE_APP_ID=your-app-id

# Cloudinary Image Storage
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

NODE_ENV=development
PORT=3000
```

### 3. Run the server
```sh
npm run dev
```
Navigate to `http://localhost:3000/api-docs` to view the interactive API documentation.

### 4. Run tests
```sh
npm test
npm run lint
```

## API Endpoints (v1)

This API strictly follows RESTful principles under the `/api/v1/` namespace. Authentication is handled via secure **HTTP-Only cookies**. 

*(Note: Frontend clients must use `withCredentials: true` in Axios or `credentials: 'include'` in Fetch).*

### User Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/auth/users/register` | Register a new user | No |
| POST | `/api/v1/auth/users/login` | Login user (Sets `token` cookie) | No |
| POST | `/api/v1/auth/users/logout` | Logout user (Clears cookie) | Yes |

### Admin Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/auth/admins/register` | Register a new admin | No |
| POST | `/api/v1/auth/admins/login` | Login admin (Sets `token` cookie) | No |
| POST | `/api/v1/auth/admins/logout` | Logout admin (Clears cookie) | Yes (Admin) |

### Dental Images
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/dental-images` | Upload image for ML gatekeeper | Yes |
| GET | `/api/v1/dental-images` | Get logged-in user's image history | Yes |

### Admin Management
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/admins` | Get list of all admins | Yes (Admin) |
| PUT | `/api/v1/admins/:id` | Update an admin's details | Yes (Admin) |
| DELETE | `/api/v1/admins/:id` | Delete an admin account | Yes (Admin) |

### User Management
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/users` | Get list of all users | Yes (Admin) |
| GET | `/api/v1/users/:userId/dental-images` | View specific user's image history | Yes (Admin) |

## Interactive Documentation (Swagger UI)
The backend features an interactive OpenAPI (Swagger) interface. 
When the server is running, navigate to `http://localhost:3000/api-docs` to view payload schemas, expected responses, and test the endpoints directly from your browser.

## Security & Guardrails

- **HTTP-Only Cookies**: JWT tokens are never exposed to client-side JavaScript.
- **Two-Tier Middleware Protection**: `verifyToken` handles global authentication, while `verifyAdmin` strictly protects administrative endpoints via fast Firestore lookups.
- **Rate Limiting**: Protects against brute-force attacks and API abuse using `express-rate-limit`. Global endpoints allow 100 requests per 15 minutes, while authentication routes are strictly limited to 5 requests per 5 minutes.
- **No Local Disk Storage**: Images are handled as in-memory buffers and streamed to Cloudinary to support free-tier PaaS deployments (Render).
- **Zod Gateway**: All incoming payload data is strictly validated before interacting with Firestore.
- **Database Optimization**: ML Results are embedded directly inside `dental_images` documents to drastically reduce Firestore read/write operations.

## Testing Status

The application currently has **110 passing tests** covering:
- **Input Validation**: Email format, strict password length, demographics.
- **Schema Validation**: Zod boundaries and enum constraints.
- **Middleware**: Firebase token verification, edge cases, and Admin authorization.
- **Routes**: REST compliance and error formatting.
- **Firebase Integration**: Admin SDK connection and strict security rules.

## Current Implementation Status

### Completed
- Express server with modular ESM structure.
- Health check endpoints and Swagger interactive documentation.
- Robust HTTP-Only cookie authentication for Users and Admins.
- ML Gatekeeper intercept logic and Cloudinary dual-upload handling.
- Zod schema validation layer.
- Admin dashboard endpoints (view users, delete admins).
- Comprehensive test suite (110 tests) and strict ESLint compliance.

### Pending
- Replacing the dummy ML route with the actual YOLOv8 FastAPI endpoint URL.
- Appointments API endpoints implementation.
- Email verification and password reset flows.
