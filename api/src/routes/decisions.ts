import express from 'express';
import { z } from 'zod';
import prisma from '../db.ts';
import { updateDecisionSchema } from '../schemas/decision.ts';
import {
  requireAuth,
  type AuthenticatedRequest,
} from '../middleware/requireAuth.ts';

const decisionsRouter = express.Router();

decisionsRouter.get('/decisions/recent', async (_request, response) => {
  try {
    const recentDecisions = await prisma.decision.findMany({
      take: 100,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        status: true,
        decisionDate: true,
        waitlistUntilTermId: true,
        createdAt: true,
        waitlistUntilTerm: {
          select: {
            id: true,
            name: true,
            academicYear: true,
          },
        },
        application: {
          select: {
            gpa: true,
            researchArea: true,
            awards: true,
            publications: true,
            comments: true,
            school: {
              select: {
                name: true,
              },
            },
            program: {
              select: {
                name: true,
                degreeLevel: true,
              },
            },
            term: {
              select: {
                name: true,
                academicYear: true,
              },
            },
          },
        },
      },
    });
    response.json(recentDecisions);
  } catch {
    response.status(500).json({
      message: 'Failed to get recent decisions.',
    });
  }
});

decisionsRouter.put(
  '/applications/:id/decision',
  requireAuth,
  async (request: AuthenticatedRequest, response) => {
  const validationResult = updateDecisionSchema.safeParse(request.body);

  if (!validationResult.success) {
    response.status(400).json({
      message: 'Invalid decision data.',
      errors: z.flattenError(validationResult.error).fieldErrors,
    });
    return;
  }

  const id = String(request.params.id);
  const { status, decisionDate, waitlistUntilTermId } = validationResult.data;
  const savedWaitlistTermId =
    status === 'WAITLISTED' ? waitlistUntilTermId : null;

  try {
    const application = await prisma.application.findUnique({
      where: {
        id,
      },
      include: {
        term: true,
      },
    });

    if (!application || application.userId !== request.user!.id) {
      response.status(404).json({
        message: 'Application not found.',
      });
      return;
    }

    if (savedWaitlistTermId) {
      const waitlistTerm = await prisma.term.findUnique({
        where: {
          id: savedWaitlistTermId,
        },
      });
      const waitlistIsLater =
        waitlistTerm &&
        (waitlistTerm.academicYear > application.term.academicYear ||
          (waitlistTerm.academicYear === application.term.academicYear &&
            application.term.name === 'Spring' &&
            waitlistTerm.name === 'Fall'));

      if (!waitlistIsLater) {
        response.status(400).json({
          message: 'The waitlist semester must be after the application semester.',
        });
        return;
      }
    }

    const decision = await prisma.decision.upsert({
      where: {
        applicationId: id,
      },
      update: {
        status,
        decisionDate,
        waitlistUntilTermId: savedWaitlistTermId,
      },
      create: {
        applicationId: id,
        status,
        decisionDate,
        waitlistUntilTermId: savedWaitlistTermId,
      },
    });

    response.json(decision);
  } catch {
    response.status(500).json({
      message: 'Failed to save decision.',
    });
  }
  },
);

export default decisionsRouter;
