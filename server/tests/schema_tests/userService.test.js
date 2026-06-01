import { userSignupSchema, userLoginSchema, userUpdateSchema } from '../../schemas/userSchema.js';

describe('User Schema Validation', () => {
  describe('User Signup Schema', () => {
    test('should validate valid signup data', () => {
      const validUser = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'SecurePassword123',
      };

      const result = userSignupSchema.safeParse(validUser);
      expect(result.success).toBe(true);
    });

    test('should reject invalid email', () => {
      const invalidUser = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'not-an-email',
        password: 'SecurePassword123',
      };

      const result = userSignupSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
    });

    test('should reject missing firstName', () => {
      const invalidUser = {
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'SecurePassword123',
      };

      const result = userSignupSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
    });

    test('should reject missing lastName', () => {
      const invalidUser = {
        firstName: 'John',
        email: 'john@example.com',
        password: 'SecurePassword123',
      };

      const result = userSignupSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
    });

    test('should reject password shorter than 6 characters', () => {
      const invalidUser = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'short',
      };

      const result = userSignupSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
    });

    test('should reject empty password', () => {
      const invalidUser = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: '',
      };

      const result = userSignupSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
    });
  });

  describe('User Login Schema', () => {
    test('should validate valid login data', () => {
      const validLogin = {
        email: 'john@example.com',
        password: 'SecurePassword123',
      };

      const result = userLoginSchema.safeParse(validLogin);
      expect(result.success).toBe(true);
    });

    test('should reject invalid email format', () => {
      const invalidLogin = {
        email: 'not-an-email',
        password: 'SecurePassword123',
      };

      const result = userLoginSchema.safeParse(invalidLogin);
      expect(result.success).toBe(false);
    });

    test('should reject missing email', () => {
      const invalidLogin = {
        password: 'SecurePassword123',
      };

      const result = userLoginSchema.safeParse(invalidLogin);
      expect(result.success).toBe(false);
    });

    test('should reject missing password', () => {
      const invalidLogin = {
        email: 'john@example.com',
      };

      const result = userLoginSchema.safeParse(invalidLogin);
      expect(result.success).toBe(false);
    });
  });

  describe('User Update Schema', () => {
    test('should allow partial update with firstName only', () => {
      const partialUpdate = {
        firstName: 'Jane',
      };

      const result = userUpdateSchema.safeParse(partialUpdate);
      expect(result.success).toBe(true);
    });

    test('should allow partial update with lastName only', () => {
      const partialUpdate = {
        lastName: 'Smith',
      };

      const result = userUpdateSchema.safeParse(partialUpdate);
      expect(result.success).toBe(true);
    });

    test('should allow update with both firstName and lastName', () => {
      const update = {
        firstName: 'Jane',
        lastName: 'Smith',
      };

      const result = userUpdateSchema.safeParse(update);
      expect(result.success).toBe(true);
    });

    test('should allow empty update object', () => {
      const emptyUpdate = {};

      const result = userUpdateSchema.safeParse(emptyUpdate);
      expect(result.success).toBe(true);
    });

    test('should reject invalid firstName type', () => {
      const invalidUpdate = {
        firstName: 123,
      };

      const result = userUpdateSchema.safeParse(invalidUpdate);
      expect(result.success).toBe(false);
    });
  });
});
