import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// MOCK FRONTEND SETUP (SAFE TO REMOVE)
// These imports are only required to serve the local public/ directory.
import path from 'path';
import { fileURLToPath } from 'url';

// api routes
import healthRoutes from './routes/health.route.js';
import userAuthRoutes from './routes/userAuth.route.js';
import adminAuthRoutes from './routes/adminAuth.route.js';
import adminManagementRoutes from './routes/adminManagement.route.js';
import adminUsersRoutes from './routes/adminUsers.route.js';
import dentalImagesRoutes from './routes/dentalImages.route.js';
import errorHandler from './middleware/errorHandler.js';

// sample ml route for testing only
import mockMLRoutes from './mocks/mockML.route.js';

const app = express();

// MOCK FRONTEND SETUP (SAFE TO REMOVE) 
// Reconstructs the __dirname variable in ES Modules to find the public folder.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

// MOCK FRONTEND SETUP (SAFE TO REMOVE)
// Serves your mock HTML/JS files. Remove this if the backend is strictly an API.
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use(healthRoutes);
app.use(userAuthRoutes);
app.use(adminAuthRoutes);
app.use(adminManagementRoutes);
app.use(adminUsersRoutes);
app.use(dentalImagesRoutes);

// sample ml route for testing only
app.use(mockMLRoutes);

// Error handling middleware
app.use(errorHandler);

export default app;
