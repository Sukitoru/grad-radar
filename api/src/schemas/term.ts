import { z } from 'zod';

export const termRequestSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { error: 'Term name is required.' })
    .max(30, { error: 'Term name must be 30 characters or less.' }),
  academicYear: z.int({
    error: 'Academic year must be a whole number.',
  }),
});
