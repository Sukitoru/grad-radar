import { z } from 'zod';

export const updateDecisionSchema = z.object({
  status: z.enum(['ACCEPTED', 'REJECTED', 'WAITLISTED']),
  decisionDate: z.coerce.date().refine((date) => date <= new Date(), {
    message: 'Decision date cannot be in the future.',
  }),
});
