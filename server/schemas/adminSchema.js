import { z } from 'zod';

const adminCreateSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  email: z.string().email('Invalid email address'),
});

const adminUpdateSchema = adminCreateSchema.partial();

export {
  adminCreateSchema,
  adminUpdateSchema,
};
