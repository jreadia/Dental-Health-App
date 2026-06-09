import { appointmentCreateSchema, appointmentUpdateSchema } from '../../schemas/appointmentSchema.js';

describe('Appointment Schema Validation', () => {
  describe('Appointment Create Schema', () => {
    test('should validate valid appointment data', () => {
      const validAppointment = {
        userId: 'user-123',
        adminId: 'admin-456',
        resultId: 'result-789',
        appointmentDate: '2026-02-15',
        appointmentTime: '14:30:00',
        status: 'Scheduled',
      };

      const result = appointmentCreateSchema.safeParse(validAppointment);
      expect(result.success).toBe(true);
    });

    test('should reject missing userId', () => {
      const invalidAppointment = {
        adminId: 'admin-456',
        resultId: 'result-789',
        appointmentDate: '2026-02-15',
        appointmentTime: '14:30:00',
        status: 'Scheduled',
      };

      const result = appointmentCreateSchema.safeParse(invalidAppointment);
      expect(result.success).toBe(false);
    });

    test('should reject missing adminId', () => {
      const invalidAppointment = {
        userId: 'user-123',
        resultId: 'result-789',
        appointmentDate: '2026-02-15',
        appointmentTime: '14:30:00',
        status: 'Scheduled',
      };

      const result = appointmentCreateSchema.safeParse(invalidAppointment);
      expect(result.success).toBe(false);
    });

    test('should reject missing resultId', () => {
      const invalidAppointment = {
        userId: 'user-123',
        adminId: 'admin-456',
        appointmentDate: '2026-02-15',
        appointmentTime: '14:30:00',
        status: 'Scheduled',
      };

      const result = appointmentCreateSchema.safeParse(invalidAppointment);
      expect(result.success).toBe(false);
    });

    test('should reject invalid date format', () => {
      const invalidAppointment = {
        userId: 'user-123',
        adminId: 'admin-456',
        resultId: 'result-789',
        appointmentDate: '02/15/2026',
        appointmentTime: '14:30:00',
        status: 'Scheduled',
      };

      const result = appointmentCreateSchema.safeParse(invalidAppointment);
      expect(result.success).toBe(false);
    });

    test('should reject invalid time format', () => {
      const invalidAppointment = {
        userId: 'user-123',
        adminId: 'admin-456',
        resultId: 'result-789',
        appointmentDate: '2026-02-15',
        appointmentTime: '2:30 PM',
        status: 'Scheduled',
      };

      const result = appointmentCreateSchema.safeParse(invalidAppointment);
      expect(result.success).toBe(false);
    });

    test('should accept all valid status values', () => {
      const validStatuses = ['Scheduled', 'Completed', 'Cancelled'];

      validStatuses.forEach((status) => {
        const appointment = {
          userId: 'user-123',
          adminId: 'admin-456',
          resultId: 'result-789',
          appointmentDate: '2026-02-15',
          appointmentTime: '14:30:00',
          status,
        };
        const result = appointmentCreateSchema.safeParse(appointment);
        expect(result.success).toBe(true);
      });
    });

    test('should default status to Scheduled if not provided', () => {
      const appointment = {
        userId: 'user-123',
        adminId: 'admin-456',
        resultId: 'result-789',
        appointmentDate: '2026-02-15',
        appointmentTime: '14:30:00',
      };

      const result = appointmentCreateSchema.safeParse(appointment);
      expect(result.success).toBe(true);
      expect(result.data.status).toBe('Scheduled');
    });

    test('should reject invalid status value', () => {
      const invalidAppointment = {
        userId: 'user-123',
        adminId: 'admin-456',
        resultId: 'result-789',
        appointmentDate: '2026-02-15',
        appointmentTime: '14:30:00',
        status: 'Pending',
      };

      const result = appointmentCreateSchema.safeParse(invalidAppointment);
      expect(result.success).toBe(false);
    });

    test('should accept valid date and time combinations', () => {
      const validCombinations = [
        { date: '2026-01-01', time: '00:00:00' },
        { date: '2026-12-31', time: '23:59:59' },
        { date: '2026-06-15', time: '12:00:00' },
      ];

      validCombinations.forEach(({ date, time }) => {
        const appointment = {
          userId: 'user-123',
          adminId: 'admin-456',
          resultId: 'result-789',
          appointmentDate: date,
          appointmentTime: time,
          status: 'Scheduled',
        };
        const result = appointmentCreateSchema.safeParse(appointment);
        expect(result.success).toBe(true);
      });
    });
  });

  describe('Appointment Update Schema', () => {
    test('should allow update with appointmentDate only', () => {
      const update = {
        appointmentDate: '2026-03-20',
      };

      const result = appointmentUpdateSchema.safeParse(update);
      expect(result.success).toBe(true);
    });

    test('should allow update with appointmentTime only', () => {
      const update = {
        appointmentTime: '15:45:00',
      };

      const result = appointmentUpdateSchema.safeParse(update);
      expect(result.success).toBe(true);
    });

    test('should allow update with status only', () => {
      const update = {
        status: 'Completed',
      };

      const result = appointmentUpdateSchema.safeParse(update);
      expect(result.success).toBe(true);
    });

    test('should allow partial update with multiple fields', () => {
      const update = {
        appointmentDate: '2026-03-20',
        appointmentTime: '15:45:00',
      };

      const result = appointmentUpdateSchema.safeParse(update);
      expect(result.success).toBe(true);
    });

    test('should allow empty update object', () => {
      const emptyUpdate = {};

      const result = appointmentUpdateSchema.safeParse(emptyUpdate);
      expect(result.success).toBe(true);
    });

    test('should reject invalid status in update', () => {
      const update = {
        status: 'Pending',
      };

      const result = appointmentUpdateSchema.safeParse(update);
      expect(result.success).toBe(false);
    });

    test('should reject invalid date format in update', () => {
      const update = {
        appointmentDate: '15-03-2026',
      };

      const result = appointmentUpdateSchema.safeParse(update);
      expect(result.success).toBe(false);
    });

    test('should reject invalid time format in update', () => {
      const update = {
        appointmentTime: '3:45 PM',
      };

      const result = appointmentUpdateSchema.safeParse(update);
      expect(result.success).toBe(false);
    });
  });
});
