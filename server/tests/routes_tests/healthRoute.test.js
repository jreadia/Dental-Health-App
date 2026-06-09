import request from 'supertest';
import app from '../../app.js';

test('GET /api/v1/health - should return a success message', async () => {
  const response = await request(app)
    .get('/api/v1/health');
  expect(response.status).toBe(200);
  expect(response.body.message).toBe('Server is healthy');
});