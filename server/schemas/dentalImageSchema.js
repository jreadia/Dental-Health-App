const { z } = require('zod');

const diagnosisSchema = z.object({
  plaqueDetected: z.boolean(),
  plaqueLevel: z.enum(['None', 'Low', 'Moderate', 'High']),
  oralHealthStatus: z.enum(['Healthy', 'Warning', 'Critical']),
  confidenceScore: z.number().min(0).max(1),
  diagnosisDate: z.string().datetime('Invalid date format'),
});

const dentalImageCreateSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  imageUrl: z.string().url('Invalid image URL'),
  uploadDate: z.string().datetime('Invalid date format'),
  diagnosis: diagnosisSchema.optional(),
});

const dentalImageUpdateSchema = z.object({
  diagnosis: diagnosisSchema.optional(),
});

module.exports = {
  dentalImageCreateSchema,
  dentalImageUpdateSchema,
  diagnosisSchema,
};
