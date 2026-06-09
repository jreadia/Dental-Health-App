import { adminSignupSchema, adminLoginSchema, adminUpdateSchema } from '../../schemas/adminSchema.js';

describe('Admin Schema Validation', () => {
  describe('Admin Signup Schema', () => {
    test('should validate valid signup data', () => {
      const validAdmin = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'admin@example.com',
        password: 'SecurePassword123',
      };

      const result = adminSignupSchema.safeParse(validAdmin);
      expect(result.success).toBe(true);
    });

    test('should reject invalid email', () => {
      const invalidAdmin = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'johnexample.com',
        password: 'SecurePassword123',
      };

      const result = adminSignupSchema.safeParse(invalidAdmin);
      expect(result.success).toBe(false);
    });

    test('should reject missing firstName', () => {
      const invalidAdmin = {
        lastName: 'Doe',
        email: 'admin@example.com',
        password: 'SecurePassword123',
      };

      const result = adminSignupSchema.safeParse(invalidAdmin);
      expect(result.success).toBe(false);
    });

    test('should reject missing lastName', () => {
      const invalidAdmin = {
        firstName: 'John',
        email: 'admin@example.com',
        password: 'SecurePassword123',
      };

      const result = adminSignupSchema.safeParse(invalidAdmin);
      expect(result.success).toBe(false);
    });

    test('should reject missing email', () => {
      const invalidAdmin = {
        firstName: 'John',
        lastName: 'Doe',
        password: 'SecurePassword123',
      };

      const result = adminSignupSchema.safeParse(invalidAdmin);
      expect(result.success).toBe(false);
    });

    test('should reject password shorter than 6 characters', () => {
      const invalidAdmin = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'admin@example.com',
        password: 'short',
      };

      const result = adminSignupSchema.safeParse(invalidAdmin);
      expect(result.success).toBe(false);
    });
  });

  describe('Admin Login Schema', () => {
    test('should validate valid login data', () => {
      const validLogin = {
        email: 'admin@example.com',
        password: 'SecurePassword123',
      };

      const result = adminLoginSchema.safeParse(validLogin);
      expect(result.success).toBe(true);
    });

    test('should reject invalid email format', () => {
      const invalidLogin = {
        email: 'notanemail',
        password: 'SecurePassword123',
      };

      const result = adminLoginSchema.safeParse(invalidLogin);
      expect(result.success).toBe(false);
    });

    test('should reject missing email', () => {
      const invalidLogin = {
        password: 'SecurePassword123',
      };

      const result = adminLoginSchema.safeParse(invalidLogin);
      expect(result.success).toBe(false);
    });

    test('should reject missing password', () => {
      const invalidLogin = {
        email: 'admin@example.com',
      };

      const result = adminLoginSchema.safeParse(invalidLogin);
      expect(result.success).toBe(false);
    });
  });

  describe('Admin Update Schema', () => {
    test('should allow partial update with firstName only', () => {
      const partialUpdate = {
        firstName: 'Jane',
      };

      const result = adminUpdateSchema.safeParse(partialUpdate);
      expect(result.success).toBe(true);
    });

    test('should allow partial update with lastName only', () => {
      const partialUpdate = {
        lastName: 'Smith',
      };

      const result = adminUpdateSchema.safeParse(partialUpdate);
      expect(result.success).toBe(true);
    });

    test('should allow update with both firstName and lastName', () => {
      const update = {
        firstName: 'Jane',
        lastName: 'Smith',
      };

      const result = adminUpdateSchema.safeParse(update);
      expect(result.success).toBe(true);
    });

    test('should allow empty update object', () => {
      const emptyUpdate = {};

      const result = adminUpdateSchema.safeParse(emptyUpdate);
      expect(result.success).toBe(true);
    });

    test('should reject invalid firstName type', () => {
      const invalidUpdate = {
        firstName: 123,
      };

      const result = adminUpdateSchema.safeParse(invalidUpdate);
      expect(result.success).toBe(false);
    });
  });
});
