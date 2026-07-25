import { z } from 'zod';
import { BUDGET_OPTIONS, STATUS_OPTIONS } from '../models/Lead.js';

export const createLeadSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .trim()
    .min(3, 'Name must be at least 3 characters'),
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .email('Invalid email address'),
  budget: z.enum(BUDGET_OPTIONS, {
    required_error: 'Budget is required',
    invalid_type_error: 'Invalid budget option',
  }),
  message: z
    .string({ required_error: 'Message is required' })
    .trim()
    .min(15, 'Message must be at least 15 characters'),
});

export const updateLeadStatusSchema = z.object({
  status: z.enum(STATUS_OPTIONS, {
    required_error: 'Status is required',
    invalid_type_error: 'Invalid status value',
  }),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadStatusInput = z.infer<typeof updateLeadStatusSchema>;
