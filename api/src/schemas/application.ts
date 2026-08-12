import { z } from 'zod';

const applicationFieldsSchema = z.object({
  schoolId: z.uuid({ error: 'A valid school ID is required.' }),
  programId: z.uuid({ error: 'A valid program ID is required.' }),
  termId: z.uuid({ error: 'A valid term ID is required.' }),
  gpa: z
    .number({ error: 'GPA must be a number.' })
    .min(0, { error: 'GPA cannot be less than 0.' })
    .max(4, { error: 'GPA cannot be greater than 4.' })
    .optional()
    .nullable(),
  researchArea: z
    .string()
    .trim()
    .max(255, { error: 'Research area must be 255 characters or less.' })
    .optional()
    .nullable(),
  awards: z.string().trim().optional().nullable(),
  publications: z
    .int({ error: 'Publications must be a whole number.' })
    .nonnegative({ error: 'Publications cannot be negative.' })
    .optional(),
  submissionDate: z.coerce
    .date({ error: 'Submission date must be a valid date.' })
    .optional()
    .nullable(),
});

export const createApplicationSchema = applicationFieldsSchema.extend({
  userId: z.uuid({ error: 'A valid user ID is required.' }),
});

export const updateApplicationSchema = applicationFieldsSchema;
