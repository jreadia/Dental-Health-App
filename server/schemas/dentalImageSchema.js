import { z } from 'zod';

const dentalImageCreateSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  imageUrl: z.string().url('Invalid image URL'),
});

const dentalImageUpdateSchema = z.object({
  imageUrl: z.string().url('Invalid image URL').optional(),
});

export {
  dentalImageCreateSchema,
  dentalImageUpdateSchema,
};
