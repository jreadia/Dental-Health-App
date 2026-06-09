# Frontend Integration Guide for Dental Health App

This document serves as a comprehensive context bridge for integrating the React frontend with this backend service. It outlines the architecture, authentication flow, specific client-side requirements, and the API surface.

## 1. Environment & Base URLs

All API routes strictly follow the `/api/v1/` namespace.

*   **Local Development:** `http://localhost:3000/api/v1`
*   **Production Server:** `https://dental-health-backend-x7b5.onrender.com/api/v1`

**Interactive API Docs:** When running the backend locally (`npm run dev`), interactive OpenAPI documentation is available at `http://localhost:3000/api-docs`.

---

## 2. Authentication (CRITICAL)

The backend handles authentication via Firebase, but issues its own **HTTP-Only JWT Cookies** for session management. **This is the most critical part of the frontend integration.**

### What you need to know:
*   **No LocalStorage:** You will **never** receive a raw token in the JSON response to save in `localStorage` or `sessionStorage`. The browser will handle the `Set-Cookie` header automatically.
*   **Credentials Flag:** Every HTTP request from the frontend (whether using Axios or Fetch) **must** be configured to send credentials. If this is missing, the browser will not attach the auth cookie, resulting in `401 Unauthorized` errors.

#### Axios Configuration Example:
```javascript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  withCredentials: true // ⚠️ CRITICAL for cookies
});

export default apiClient;
```

#### Fetch API Example:
```javascript
fetch('http://localhost:3000/api/v1/dental-images', {
  method: 'GET',
  credentials: 'include' // ⚠️ CRITICAL for cookies
});
```

### State Management
Since you don't have a token to verify if a user is logged in, you should rely on the `user` object returned by the `/login` or `/register` endpoints. 
Store this `user` object in your global React state (e.g., Context API, Redux, or Zustand). When this object is `null`, treat the user as logged out.

---

## 3. Data Uploads (Multipart/Form-Data)

The `/api/v1/dental-images` POST endpoint acts as a gatekeeper for the ML Inference service. It expects a file upload, which means you cannot send a standard JSON payload.

You **must** use a `FormData` object in React:

```javascript
const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file); // 'image' is the field name expected by backend Multer

  await apiClient.post('/dental-images', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};
```

---

## 4. Backend CORS Configuration (Action Item)

Because your React frontend is in a different repository (and will run on a different port locally, e.g., `5173`), Cross-Origin Resource Sharing (CORS) becomes an issue.

**Current Backend State:** The backend currently uses a broad `app.use(cors())` which translates to `Access-Control-Allow-Origin: *`.
**The Problem:** The wildcard `*` is strictly forbidden by browsers when `withCredentials: true` is used.

**Action Required:** Before integrating, you (or the backend developer) must update `server/app.js` to explicitly allow the frontend's origin:

```javascript
// server/app.js
app.use(cors({
  origin: 'http://localhost:5173', // Change this to your exact React dev server URL
  credentials: true 
}));
```

---

## 5. High-Level API Overview

Below is a quick map of the available endpoints. (For exact payloads, refer to the Swagger UI).

### User Auth
*   `POST /auth/users/register` - Creates a user (Requires demographics, password).
*   `POST /auth/users/login` - Logs in a user. Returns a `user` object and sets the HTTP-Only cookie.
*   `POST /auth/users/logout` - Clears the HTTP-Only cookie.

### Admin Auth
*   `POST /auth/admins/register` - Creates an admin.
*   `POST /auth/admins/login` - Logs in an admin.
*   `POST /auth/admins/logout` - Clears the admin cookie.

### Dental Images (User Protected)
*   `POST /dental-images` - Uploads a new image (triggers ML gatekeeper and Cloudinary upload).
*   `GET /dental-images` - Fetches the logged-in user's historical scans.

### Admin Management (Admin Protected)
*   `GET /admins` - List all admins.
*   `PUT /admins/:id` - Update admin info.
*   `DELETE /admins/:id` - Delete an admin.

### User Management (Admin Protected)
*   `GET /users` - List all registered users.
*   `GET /users/:userId/dental-images` - View a specific user's scan history.
