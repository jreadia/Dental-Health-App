const { userCreateSchema, userUpdateSchema } = require('../schemas/userSchema');

describe('User Schema Validation', () => {
  test('should validate valid user data', () => {
    const validUser = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      birthDate: '2000-01-01T00:00:00Z',
      sex: 'Male',
      address: '123 Main St',
    };

    const result = userCreateSchema.safeParse(validUser);
    expect(result.success).toBe(true);
  });

  test('should reject invalid email', () => {
    const invalidUser = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'not-an-email',
      birthDate: '2000-01-01T00:00:00Z',
      sex: 'Male',
      address: '123 Main St',
    };

    const result = userCreateSchema.safeParse(invalidUser);
    expect(result.success).toBe(false);
  });

  test('should reject missing firstName', () => {
    const invalidUser = {
      lastName: 'Doe',
      email: 'john@example.com',
      birthDate: '2000-01-01T00:00:00Z',
      sex: 'Male',
      address: '123 Main St',
    };

    const result = userCreateSchema.safeParse(invalidUser);
    expect(result.success).toBe(false);
  });

  test('should allow partial updates', () => {
    const partialUpdate = {
      firstName: 'Jane',
    };

    const result = userUpdateSchema.safeParse(partialUpdate);
    expect(result.success).toBe(true);
  });

  test('should reject invalid sex value', () => {
    const invalidUser = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      birthDate: '2000-01-01T00:00:00Z',
      sex: 'I dont know',
      address: '123 Main St',
    };

    const result = userCreateSchema.safeParse(invalidUser);
    expect(result.success).toBe(false);
  });
});