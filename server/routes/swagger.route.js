import express from 'express';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const swaggerDocument = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../swagger.json'), 'utf8'));

const router = express.Router();

// Redirect root to Swagger API Documentation
router.get('/', (req, res) => {
  res.redirect('/api-docs/');
});

// Serve Swagger UI with a trailing slash enforcer
router.use('/api-docs', (req, res, next) => {
  if (req.originalUrl === '/api-docs') {
    return res.redirect('/api-docs/');
  }
  next();
}, swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  swaggerOptions: {
    withCredentials: true
  }
}));

export default router;
