const { z } = require('zod');

const userCreateSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  email: z.string().email('Invalid email address'),
  birthDate: z.string().datetime('Invalid date format'),
  sex: z.enum(['Male', 'Female', 'Other']),
  address: z.string().min(1, 'Address is required').max(200),
});

const userUpdateSchema = userCreateSchema.partial();

module.exports = {
  userCreateSchema,
  userUpdateSchema,
};
