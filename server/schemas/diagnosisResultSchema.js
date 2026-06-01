import { z } from 'zod';

const diagnosisResultCreateSchema = z.object({
  imageId: z.string().min(1, 'Image ID is required'),
  plaqueDetected: z.boolean(),
  plaqueLevel: z.enum(['None', 'Low', 'Moderate', 'High']),
  oralHealthStatus: z.enum(['Healthy', 'Warning', 'Critical']),
  confidenceScore: z.number().min(0).max(100, 'Confidence score must be between 0 and 100'),
});

const diagnosisResultUpdateSchema = diagnosisResultCreateSchema.partial();

export {
  diagnosisResultCreateSchema,
  diagnosisResultUpdateSchema,
};
