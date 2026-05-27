const express = require('express');
const cors = require('cors');
const { db } = require('./config/config');
const healthRoutes = require('./routes/health');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.use('/', healthRoutes);

// Error handling middleware
app.use(errorHandler);

module.exports = app;
