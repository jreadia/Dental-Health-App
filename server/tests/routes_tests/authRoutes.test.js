import request from 'supertest';
import app from '../../app.js';

describe('User Authentication Routes', () => {
  describe('POST /api/v1/auth/users/register', () => {
    test('should return 400 when required fields are missing', async () => {
      const response = await request(app)
        .post('/api/v1/auth/users/register')
        .send({
          firstName: 'John',
          email: 'john@example.com',
          password: 'SecurePassword123',
          // Missing lastName, phoneNumber, address, birthday
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid Input');
    });

    test('should return 400 when email is invalid', async () => {
      const response = await request(app)
        .post('/api/v1/auth/users/register')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'invalid-email',
          password: 'SecurePassword123',
          phoneNumber: '123-456-7890',
          address: '123 Main St',
          birthday: '1990-01-01',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid Input');
    });

    test('should return 400 when password is too short', async () => {
      const response = await request(app)
        .post('/api/v1/auth/users/register')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          password: 'short',
          phoneNumber: '123-456-7890',
          address: '123 Main St',
          birthday: '1990-01-01',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid Input');
    });

    test('should return 400 when firstName is missing', async () => {
      const response = await request(app)
        .post('/api/v1/auth/users/register')
        .send({
          lastName: 'Doe',
          email: 'john@example.com',
          password: 'SecurePassword123',
          phoneNumber: '123-456-7890',
          address: '123 Main St',
          birthday: '1990-01-01',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid Input');
    });

    test('should return 400 when lastName is missing', async () => {
      const response = await request(app)
        .post('/api/v1/auth/users/register')
        .send({
          firstName: 'John',
          email: 'john@example.com',
          password: 'SecurePassword123',
          phoneNumber: '123-456-7890',
          address: '123 Main St',
          birthday: '1990-01-01',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid Input');
    });
  });

  describe('POST /api/v1/auth/users/login', () => {
    test('should return 400 when email is missing', async () => {
      const response = await request(app)
        .post('/api/v1/auth/users/login')
        .send({
          password: 'SecurePassword123',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid Input');
    });

    test('should return 400 when password is missing', async () => {
      const response = await request(app)
        .post('/api/v1/auth/users/login')
        .send({
          email: 'john@example.com',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid Input');
    });

    test('should return 400 when email format is invalid', async () => {
      const response = await request(app)
        .post('/api/v1/auth/users/login')
        .send({
          email: 'invalid-email',
          password: 'SecurePassword123',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid Input');
    });

    test('should return 400 or 500 for login attempt without Firebase API key', async () => {
      const response = await request(app)
        .post('/api/v1/auth/users/login')
        .send({
          email: 'test@example.com',
          password: 'TestPassword123',
        });

      expect([400, 500]).toContain(response.status);
    });
  });
});
