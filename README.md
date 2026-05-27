# Dental Web Application Backend

This is the backend for the Dental Web Application, built with Node.js, Express, Firebase, and Roboflow, following strict DevOps and architecture guidelines.

## Project Structure

```
server/
  app.js                # Main Express app (routes, middleware)
  server.js             # Entry point to start the server
  /routes               # Route handlers (upload, appointments, users, etc.)
  /middleware           # Custom middleware (auth, error handling)
  /schemas              # Zod schemas for validation
  /services             # Firebase Admin, Roboflow integration
  /utils                # Utility modules (logger, etc.)
  /config               # Configuration files
  /tests                # Unit/integration tests
  serviceAccountKey.json# Firebase Admin SDK key (DO NOT COMMIT)
```

## Setup Instructions

1. **Clone the repository and switch to the backend branch:**
   ```sh
   git clone <repo-url>
   cd <repo-name>
   git checkout backend
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Environment Variables:**
   - Copy `.env.example` to `.env` and fill in your Firebase and Roboflow credentials.
   - Place your `serviceAccountKey.json` in the `server/` directory (never commit this file).

4. **Run the server:**
   ```sh
   node server.js
   ```

5. **Run tests:**
   ```sh
   npm test
   ```

## Key Technologies
- Node.js + Express
- Firebase Admin SDK (Firestore, Storage, Auth)
- Roboflow API (YOLOv8)
- Multer (in-memory file uploads)
- Zod (input validation)
- Jest & Supertest (unit/integration testing)

## Architecture Guardrails
- No local disk storage (all uploads in-memory, streamed to Firebase Storage)
- All sensitive endpoints protected by Firebase Auth token verification
- Data denormalization for fast NoSQL reads
- Predictable JSON API contracts enforced with Zod

## Contribution
- Follow the 4-week milestone plan and keep PRs focused and small.
- All code must pass linting and tests before merging.
- Never commit secrets or service account keys.

## License
MIT
