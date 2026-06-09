import { z } from 'zod';

const dentalImageCreateSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  originalImageUrl: z.string().url('Invalid image URL').optional(),
  imageUrl: z.string().url('Invalid image URL').optional(), // Kept for backwards compatibility
  annotatedImageUrl: z.string().url('Invalid image URL').optional(),
  mlResults: z.any().optional(),
});

const dentalImageUpdateSchema = z.object({
  imageUrl: z.string().url('Invalid image URL').optional(),
});

export {
  dentalImageCreateSchema,
  dentalImageUpdateSchema,
};
