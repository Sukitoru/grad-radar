import { z } from 'zod';

export const updateDecisionSchema = z
  .object({
    status: z.enum(['ACCEPTED', 'REJECTED', 'WAITLISTED']),
    decisionDate: z.coerce.date().refine((date) => date <= new Date(), {
      message: 'Decision date cannot be in the future.',
    }),
    waitlistUntilTermId: z.string().uuid().nullable().optional(),
  })
  .refine(
    (decision) =>
      decision.status !== 'WAITLISTED' || Boolean(decision.waitlistUntilTermId),
    {
      message: 'Waitlisted decisions require an ending semester.',
      path: ['waitlistUntilTermId'],
    },
  );
