import { z } from 'zod';

const userSignupSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const userLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const userUpdateSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50).optional(),
  lastName: z.string().min(1, 'Last name is required').max(50).optional(),
});

export {
  userSignupSchema,
  userLoginSchema,
  userUpdateSchema,
};
