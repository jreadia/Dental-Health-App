import { diagnosisResultCreateSchema, diagnosisResultUpdateSchema } from '../../schemas/diagnosisResultSchema.js';

describe('Diagnosis Result Schema Validation', () => {
  describe('Diagnosis Result Create Schema', () => {
    test('should validate valid diagnosis result data', () => {
      const validDiagnosis = {
        imageId: 'image-123',
        plaqueDetected: true,
        plaqueLevel: 'Moderate',
        oralHealthStatus: 'Warning',
        confidenceScore: 87.5,
      };

      const result = diagnosisResultCreateSchema.safeParse(validDiagnosis);
      expect(result.success).toBe(true);
    });

    test('should reject missing imageId', () => {
      const invalidDiagnosis = {
        plaqueDetected: true,
        plaqueLevel: 'Moderate',
        oralHealthStatus: 'Warning',
        confidenceScore: 87.5,
      };

      const result = diagnosisResultCreateSchema.safeParse(invalidDiagnosis);
      expect(result.success).toBe(false);
    });

    test('should reject empty imageId', () => {
      const invalidDiagnosis = {
        imageId: '',
        plaqueDetected: true,
        plaqueLevel: 'Moderate',
        oralHealthStatus: 'Warning',
        confidenceScore: 87.5,
      };

      const result = diagnosisResultCreateSchema.safeParse(invalidDiagnosis);
      expect(result.success).toBe(false);
    });

    test('should reject invalid plaqueLevel', () => {
      const invalidDiagnosis = {
        imageId: 'image-123',
        plaqueDetected: true,
        plaqueLevel: 'InvalidLevel',
        oralHealthStatus: 'Warning',
        confidenceScore: 87.5,
      };

      const result = diagnosisResultCreateSchema.safeParse(invalidDiagnosis);
      expect(result.success).toBe(false);
    });

    test('should accept all valid plaqueLevel values', () => {
      const validLevels = ['None', 'Low', 'Moderate', 'High'];

      validLevels.forEach((level) => {
        const diagnosis = {
          imageId: 'image-123',
          plaqueDetected: true,
          plaqueLevel: level,
          oralHealthStatus: 'Warning',
          confidenceScore: 87.5,
        };
        const result = diagnosisResultCreateSchema.safeParse(diagnosis);
        expect(result.success).toBe(true);
      });
    });

    test('should reject invalid oralHealthStatus', () => {
      const invalidDiagnosis = {
        imageId: 'image-123',
        plaqueDetected: true,
        plaqueLevel: 'Moderate',
        oralHealthStatus: 'InvalidStatus',
        confidenceScore: 87.5,
      };

      const result = diagnosisResultCreateSchema.safeParse(invalidDiagnosis);
      expect(result.success).toBe(false);
    });

    test('should accept all valid oralHealthStatus values', () => {
      const validStatuses = ['Healthy', 'Warning', 'Critical'];

      validStatuses.forEach((status) => {
        const diagnosis = {
          imageId: 'image-123',
          plaqueDetected: true,
          plaqueLevel: 'Moderate',
          oralHealthStatus: status,
          confidenceScore: 87.5,
        };
        const result = diagnosisResultCreateSchema.safeParse(diagnosis);
        expect(result.success).toBe(true);
      });
    });

    test('should reject confidence score below 0', () => {
      const invalidDiagnosis = {
        imageId: 'image-123',
        plaqueDetected: true,
        plaqueLevel: 'Moderate',
        oralHealthStatus: 'Warning',
        confidenceScore: -5,
      };

      const result = diagnosisResultCreateSchema.safeParse(invalidDiagnosis);
      expect(result.success).toBe(false);
    });

    test('should reject confidence score above 100', () => {
      const invalidDiagnosis = {
        imageId: 'image-123',
        plaqueDetected: true,
        plaqueLevel: 'Moderate',
        oralHealthStatus: 'Warning',
        confidenceScore: 150,
      };

      const result = diagnosisResultCreateSchema.safeParse(invalidDiagnosis);
      expect(result.success).toBe(false);
    });

    test('should accept confidence scores between 0 and 100', () => {
      const validScores = [0, 50, 87.5, 100];

      validScores.forEach((score) => {
        const diagnosis = {
          imageId: 'image-123',
          plaqueDetected: true,
          plaqueLevel: 'Moderate',
          oralHealthStatus: 'Warning',
          confidenceScore: score,
        };
        const result = diagnosisResultCreateSchema.safeParse(diagnosis);
        expect(result.success).toBe(true);
      });
    });

    test('should accept both plaqueDetected values', () => {
      const boolValues = [true, false];

      boolValues.forEach((value) => {
        const diagnosis = {
          imageId: 'image-123',
          plaqueDetected: value,
          plaqueLevel: 'Moderate',
          oralHealthStatus: 'Warning',
          confidenceScore: 87.5,
        };
        const result = diagnosisResultCreateSchema.safeParse(diagnosis);
        expect(result.success).toBe(true);
      });
    });
  });

  describe('Diagnosis Result Update Schema', () => {
    test('should allow update with plaqueDetected only', () => {
      const update = {
        plaqueDetected: false,
      };

      const result = diagnosisResultUpdateSchema.safeParse(update);
      expect(result.success).toBe(true);
    });

    test('should allow update with plaqueLevel only', () => {
      const update = {
        plaqueLevel: 'High',
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

    test('should allow update with confidenceScore only', () => {
      const update = {
        confidenceScore: 95,
      };

      const result = diagnosisResultUpdateSchema.safeParse(update);
      expect(result.success).toBe(true);
    });

    test('should allow partial update with multiple fields', () => {
      const update = {
        plaqueLevel: 'Low',
        confidenceScore: 75.5,
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
        plaqueLevel: 'InvalidLevel',
      };

      const result = diagnosisResultUpdateSchema.safeParse(invalidUpdate);
      expect(result.success).toBe(false);
    });
  });
});
