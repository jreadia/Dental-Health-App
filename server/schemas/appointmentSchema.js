import { z } from 'zod';

const appointmentCreateSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  adminId: z.string().min(1, 'Admin ID is required'),
  resultId: z.string().min(1, 'Diagnosis Result ID is required'),
  appointmentDate: z.string().date('Invalid date format (YYYY-MM-DD)'),
  appointmentTime: z.string().time('Invalid time format (HH:mm:ss)'),
  status: z.enum(['Scheduled', 'Completed', 'Cancelled']).default('Scheduled'),
});

const appointmentUpdateSchema = z.object({
  appointmentDate: z.string().date('Invalid date format (YYYY-MM-DD)').optional(),
  appointmentTime: z.string().time('Invalid time format (HH:mm:ss)').optional(),
  status: z.enum(['Scheduled', 'Completed', 'Cancelled']).optional(),
});

export {
  appointmentCreateSchema,
  appointmentUpdateSchema,
};
