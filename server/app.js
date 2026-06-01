import express from 'express';
import cors from 'cors';
import { db } from './config/config.js';
import healthRoutes from './routes/health.js';
import authRoutes from './routes/auth.js';
import adminAuthRoutes from './routes/adminAuth.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.use('/', healthRoutes);
app.use('/', authRoutes);
app.use('/', adminAuthRoutes);

// Error handling middleware
app.use(errorHandler);

export default app;
