import { dentalImageCreateSchema, dentalImageUpdateSchema } from '../../schemas/dentalImageSchema.js';

describe('Dental Image Schema Validation', () => {
  describe('Dental Image Create Schema', () => {
    test('should validate valid dental image data', () => {
      const validImage = {
        userId: 'user-123',
        imageUrl: 'https://example.com/images/dental1.jpg',
      };

      const result = dentalImageCreateSchema.safeParse(validImage);
      expect(result.success).toBe(true);
    });

    test('should reject missing userId', () => {
      const invalidImage = {
        imageUrl: 'https://example.com/images/dental1.jpg',
      };

      const result = dentalImageCreateSchema.safeParse(invalidImage);
      expect(result.success).toBe(false);
    });

    test('should reject empty userId', () => {
      const invalidImage = {
        userId: '',
        imageUrl: 'https://example.com/images/dental1.jpg',
      };

      const result = dentalImageCreateSchema.safeParse(invalidImage);
      expect(result.success).toBe(false);
    });

    test('should reject invalid URL format', () => {
      const invalidImage = {
        userId: 'user-123',
        imageUrl: 'not-a-url',
      };

      const result = dentalImageCreateSchema.safeParse(invalidImage);
      expect(result.success).toBe(false);
    });

    test('should accept various valid URL formats', () => {
      const validUrls = [
        'https://example.com/image.jpg',
        'https://cdn.example.com/images/dental.png',
        'https://storage.example.com/dental-images/123.jpg',
      ];

      validUrls.forEach((url) => {
        const image = {
          userId: 'user-123',
          imageUrl: url,
        };
        const result = dentalImageCreateSchema.safeParse(image);
        expect(result.success).toBe(true);
      });
    });
  });

  describe('Dental Image Update Schema', () => {
    test('should allow update with imageUrl only', () => {
      const update = {
        imageUrl: 'https://example.com/images/dental-updated.jpg',
      };

      const result = dentalImageUpdateSchema.safeParse(update);
      expect(result.success).toBe(true);
    });

    test('should allow empty update object', () => {
      const emptyUpdate = {};

      const result = dentalImageUpdateSchema.safeParse(emptyUpdate);
      expect(result.success).toBe(true);
    });

    test('should reject invalid imageUrl format', () => {
      const invalidUpdate = {
        imageUrl: 'not-a-url',
      };

      const result = dentalImageUpdateSchema.safeParse(invalidUpdate);
      expect(result.success).toBe(false);
    });
  });
});
