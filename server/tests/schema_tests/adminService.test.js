import { adminCreateSchema, adminUpdateSchema } from "../../schemas/adminSchema.js";

describe('Admin Schema Validation', () => {
    test('should validate valid admin data', () => {
        const validAdmin = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com'
        };

        const result = adminCreateSchema.safeParse(validAdmin);
        expect(result.success).toBe(true);
    });

    test('should validate valid info update', () => {
        const updateAdmin = {
            lastName: 'Doer',
        };

        const result = adminUpdateSchema.safeParse(updateAdmin);
        expect(result.success).toBe(true);
    });

    test('should reject invalid email', () => {
        const invalidAdmin = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'johnexample.com'
        };

        const result = adminCreateSchema.safeParse(invalidAdmin);
        expect(result.success).toBe(false);
    });

    test('should reject missing firstName', () => {
        const invalidAdmin = {
            lastName: 'Doe',
            email: 'john@example.com'
        };

        const result = adminCreateSchema.safeParse(invalidAdmin);
        expect(result.success).toBe(false);
    });

    test('should reject missing lastName', () => {
        const invalidAdmin = {
            firstName: 'John',
            email: 'john@example.com'
        };

        const result = adminCreateSchema.safeParse(invalidAdmin);
        expect(result.success).toBe(false);
    });

    test('should reject missing email', () => {
        const invalidAdmin = {
            firstName: 'John',
            lastName: 'Doe'
        };

        const result = adminCreateSchema.safeParse(invalidAdmin);
        expect(result.success).toBe(false);
    });    
}); 