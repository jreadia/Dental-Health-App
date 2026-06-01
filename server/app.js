import express from 'express';
import cors from 'cors';

// MOCK FRONTEND SETUP (SAFE TO REMOVE)
// These imports are only required to serve the local public/ directory.
import path from 'path';
import { fileURLToPath } from 'url';

// api routes
import healthRoutes from './routes/health.js';
import authRoutes from './routes/auth.js';
import adminAuthRoutes from './routes/adminAuth.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

// MOCK FRONTEND SETUP (SAFE TO REMOVE) 
// Reconstructs the __dirname variable in ES Modules to find the public folder.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// MOCK FRONTEND SETUP (SAFE TO REMOVE)
// Serves your mock HTML/JS files. Remove this if the backend is strictly an API.
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/', healthRoutes);
app.use('/', authRoutes);
app.use('/', adminAuthRoutes);

// Error handling middleware
app.use(errorHandler);

export default app;
