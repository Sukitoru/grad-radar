import { z } from 'zod';

export const updateDecisionSchema = z.object({
  status: z.enum(['ACCEPTED', 'REJECTED', 'WAITLISTED'], {
    errorMap: () => ({ message: "Status must be either ACCEPTED, REJECTED, or WAITLISTED." })
  }),
  decisionDate: z.string()
    .datetime({ message: "Invalid ISO date string format." })
    .preprocess((val) => new Date(val as string), z.date())
    .refine((date) => date <= new Date(), {
      message: "Decision date cannot be in the future.",
    })
});
export type UpdateDecisionInput = z.infer<typeof updateDecisionSchema>;