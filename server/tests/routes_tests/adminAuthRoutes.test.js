import request from 'supertest';
import app from '../../app.js';

describe('Admin Authentication Routes', () => {
  describe('POST /api/v1/auth/admins/register', () => {
    test('should return 400 when required fields are missing', async () => {
      const response = await request(app)
        .post('/api/v1/auth/admins/register')
        .send({
          firstName: 'Admin',
          email: 'admin@example.com',
          password: 'SecurePassword123',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid Input');
    });

    test('should return 400 when email is invalid', async () => {
      const response = await request(app)
        .post('/api/v1/auth/admins/register')
        .send({
          firstName: 'Admin',
          lastName: 'User',
          email: 'invalid-email',
          password: 'SecurePassword123',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid Input');
    });

    test('should return 400 when password is too short', async () => {
      const response = await request(app)
        .post('/api/v1/auth/admins/register')
        .send({
          firstName: 'Admin',
          lastName: 'User',
          email: 'admin@example.com',
          password: 'short',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid Input');
    });

    test('should return 400 when firstName is missing', async () => {
      const response = await request(app)
        .post('/api/v1/auth/admins/register')
        .send({
          lastName: 'User',
          email: 'admin@example.com',
          password: 'SecurePassword123',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid Input');
    });

    test('should return 400 when lastName is missing', async () => {
      const response = await request(app)
        .post('/api/v1/auth/admins/register')
        .send({
          firstName: 'Admin',
          email: 'admin@example.com',
          password: 'SecurePassword123',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid Input');
    });
  });

  describe('POST /api/v1/auth/admins/login', () => {
    test('should return 400 when email is missing', async () => {
      const response = await request(app)
        .post('/api/v1/auth/admins/login')
        .send({
          password: 'SecurePassword123',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid Input');
    });

    test('should return 400 when password is missing', async () => {
      const response = await request(app)
        .post('/api/v1/auth/admins/login')
        .send({
          email: 'admin@example.com',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid Input');
    });

    test('should return 400 when email format is invalid', async () => {
      const response = await request(app)
        .post('/api/v1/auth/admins/login')
        .send({
          email: 'invalid-email',
          password: 'SecurePassword123',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid Input');
    });

    test('should return 400 or 500 for login attempt without Firebase API key', async () => {
      const response = await request(app)
        .post('/api/v1/auth/admins/login')
        .send({
          email: 'admin@example.com',
          password: 'TestPassword123',
        });

      expect([400, 500]).toContain(response.status);
    });
  });
});
