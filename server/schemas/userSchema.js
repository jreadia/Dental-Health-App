import { z } from 'zod';

const userSignupSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  address: z.string().min(1, 'Address is required'),
  birthday: z.string().date('Invalid date format, use YYYY-MM-DD'),
});

const userLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const userUpdateSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50).optional(),
  lastName: z.string().min(1, 'Last name is required').max(50).optional(),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  birthday: z.string().date('Invalid date format, use YYYY-MM-DD').optional(),
});

export {
  userSignupSchema,
  userLoginSchema,
  userUpdateSchema,
};
