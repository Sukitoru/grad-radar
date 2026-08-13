import { z } from 'zod';

export const schoolRequestSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { error: 'School name is required.' })
    .max(160, { error: 'School name must be 160 characters or less.' }),
});
