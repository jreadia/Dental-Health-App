import request from 'supertest';
import app from '../../app.js';

test('GET /api/health - should return a success message', async () => {
  const response = await request(app)
    .get('/api/health');
  expect(response.status).toBe(200);
  expect(response.body.message).toBe('Server is healthy');
});