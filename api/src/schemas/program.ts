import { z } from 'zod';

export const programRequestSchema = z.object({
  schoolId: z.uuid({
    error: 'A valid school ID is required.',
  }),
  name: z
    .string()
    .trim()
    .min(1, { error: 'Program name is required.' })
    .max(160, { error: 'Program name must be 160 characters or less.' }),
  degreeLevel: z.enum(['Masters', 'Doctoral'], {
    error: 'Degree level must be Masters or Doctoral.',
  }),
});
