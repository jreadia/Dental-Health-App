import { z } from 'zod';

const diagnosisResultCreateSchema = z.object({
  imageId: z.string().min(1, 'Image ID is required'),
  calculusDetected: z.boolean(),
  calculusAmount: z.number().int().nonnegative(),
  oralHealthStatus: z.enum(['Healthy', 'Warning', 'Critical']),
});

const diagnosisResultUpdateSchema = diagnosisResultCreateSchema.partial();

export {
  diagnosisResultCreateSchema,
  diagnosisResultUpdateSchema,
};
