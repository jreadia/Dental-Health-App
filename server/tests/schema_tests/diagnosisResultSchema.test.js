import { diagnosisResultCreateSchema, diagnosisResultUpdateSchema } from '../../schemas/diagnosisResultSchema.js';

describe('Diagnosis Result Schema Validation', () => {
  describe('Diagnosis Result Create Schema', () => {
    test('should validate valid diagnosis result data', () => {
      const validDiagnosis = {
        imageId: 'image-123',
        calculusDetected: true,
        calculusAmount: 15,
        oralHealthStatus: 'Warning',
      };

      const result = diagnosisResultCreateSchema.safeParse(validDiagnosis);
      expect(result.success).toBe(true);
    });

    test('should reject missing imageId', () => {
      const invalidDiagnosis = {
        calculusDetected: true,
        calculusAmount: 15,
        oralHealthStatus: 'Warning',
      };

      const result = diagnosisResultCreateSchema.safeParse(invalidDiagnosis);
      expect(result.success).toBe(false);
    });

    test('should reject empty imageId', () => {
      const invalidDiagnosis = {
        imageId: '',
        calculusDetected: true,
        calculusAmount: 15,
        oralHealthStatus: 'Warning',
      };

      const result = diagnosisResultCreateSchema.safeParse(invalidDiagnosis);
      expect(result.success).toBe(false);
    });

    test('should reject invalid calculusAmount type', () => {
      const invalidDiagnosis = {
        imageId: 'image-123',
        calculusDetected: true,
        calculusAmount: 'High',
        oralHealthStatus: 'Warning',
      };

      const result = diagnosisResultCreateSchema.safeParse(invalidDiagnosis);
      expect(result.success).toBe(false);
    });

    test('should reject negative calculusAmount', () => {
      const invalidDiagnosis = {
        imageId: 'image-123',
        calculusDetected: true,
        calculusAmount: -5,
        oralHealthStatus: 'Warning',
      };

      const result = diagnosisResultCreateSchema.safeParse(invalidDiagnosis);
      expect(result.success).toBe(false);
    });

    test('should accept all valid calculusAmount values', () => {
      const validLevels = [0, 5, 10, 50, 100];

      validLevels.forEach((level) => {
        const diagnosis = {
          imageId: 'image-123',
          calculusDetected: true,
          calculusAmount: level,
          oralHealthStatus: 'Warning',
        };
        const result = diagnosisResultCreateSchema.safeParse(diagnosis);
        expect(result.success).toBe(true);
      });
    });

    test('should reject invalid oralHealthStatus', () => {
      const invalidDiagnosis = {
        imageId: 'image-123',
        calculusDetected: true,
        calculusAmount: 15,
        oralHealthStatus: 'InvalidStatus',
      };

      const result = diagnosisResultCreateSchema.safeParse(invalidDiagnosis);
      expect(result.success).toBe(false);
    });

    test('should accept all valid oralHealthStatus values', () => {
      const validStatuses = ['Healthy', 'Warning', 'Critical'];

      validStatuses.forEach((status) => {
        const diagnosis = {
          imageId: 'image-123',
          calculusDetected: true,
          calculusAmount: 15,
          oralHealthStatus: status,
        };
        const result = diagnosisResultCreateSchema.safeParse(diagnosis);
        expect(result.success).toBe(true);
      });
    });

    test('should accept both calculusDetected values', () => {
      const boolValues = [true, false];

      boolValues.forEach((value) => {
        const diagnosis = {
          imageId: 'image-123',
          calculusDetected: value,
          calculusAmount: 15,
          oralHealthStatus: 'Warning',
        };
        const result = diagnosisResultCreateSchema.safeParse(diagnosis);
        expect(result.success).toBe(true);
      });
    });
  });

  describe('Diagnosis Result Update Schema', () => {
    test('should allow update with calculusDetected only', () => {
      const update = {
        calculusDetected: false,
      };

      const result = diagnosisResultUpdateSchema.safeParse(update);
      expect(result.success).toBe(true);
    });

    test('should allow update with calculusAmount only', () => {
      const update = {
        calculusAmount: 20,
      };

      const result = diagnosisResultUpdateSchema.safeParse(update);
      expect(result.success).toBe(true);
    });

    test('should allow update with oralHealthStatus only', () => {
      const update = {
        oralHealthStatus: 'Critical',
      };

      const result = diagnosisResultUpdateSchema.safeParse(update);
      expect(result.success).toBe(true);
    });

    test('should allow partial update with multiple fields', () => {
      const update = {
        calculusAmount: 5,
        oralHealthStatus: 'Healthy',
      };

      const result = diagnosisResultUpdateSchema.safeParse(update);
      expect(result.success).toBe(true);
    });

    test('should allow empty update object', () => {
      const emptyUpdate = {};

      const result = diagnosisResultUpdateSchema.safeParse(emptyUpdate);
      expect(result.success).toBe(true);
    });

    test('should reject invalid values in update', () => {
      const invalidUpdate = {
        calculusAmount: -10,
      };

      const result = diagnosisResultUpdateSchema.safeParse(invalidUpdate);
      expect(result.success).toBe(false);
    });
  });
});
