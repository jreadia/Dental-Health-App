import request from 'supertest';
import app from '../../app.js';

test('GET /api/registerUser - should return a success that endpoint works', async () => {
  const response = await request(app)
    .get('/api/registerUser');
  expect(response.status).toBe(200);
  expect(response.body.message).toBe('Register endpoint is working');
});

test('POST /api/registerUser - should register a new user', async () => {
  const response = await request(app)
    .post('/api/registerUser')
    .send({ 
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      birthDate: '2000-01-01T00:00:00Z',
      sex: 'Male',
      address: '123 Main St',
    });
  expect(response.status).toBe(200);
  expect(response.body.message).toBe('User with email john@example.com registered successfully');
});

test('POST /api/registerUser - should not register with a missing field', async () => {
  const response = await request(app)
    .post('/api/registerUser')
    .send({
      lastName: 'Doe',
    });
  expect(response.status).toBe(400);
});

test('POST /api/registerUser - should not register with invalid email', async () => {
  const response = await request(app)
    .post('/api/registerUser')
    .send({ 
      firstName: 'John',
      lastName: 'Doe',
      email: 'johnexample.com',
      birthDate: '2000-01-01T00:00:00Z',
      sex: 'Male',
      address: '123 Main St',
    });
  expect(response.status).toBe(400);
});
