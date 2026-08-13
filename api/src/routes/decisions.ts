import express from 'express';
import { z } from 'zod';
import prisma from '../db.ts';
import { updateDecisionSchema } from '../schemas/decision.ts';

const decisionsRouter = express.Router();

decisionsRouter.get('/decisions/recent', async (_request, response) => {
  try {
    const recentDecisions = await prisma.decision.findMany({
      orderBy: {
        decisionDate: 'desc',
      },
      select: {
        id: true,
        status: true,
        decisionDate: true,
        createdAt: true,
        application: {
          select: {
            gpa: true,
            researchArea: true,
            awards: true,
            publications: true,
            publicationLinks: true,
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

decisionsRouter.put('/applications/:id/decision', async (request, response) => {
  const validationResult = updateDecisionSchema.safeParse(request.body);

  if (!validationResult.success) {
    response.status(400).json({
      message: 'Invalid decision data.',
      errors: z.flattenError(validationResult.error).fieldErrors,
    });
    return;
  }

  const { id } = request.params;
  const { status, decisionDate } = validationResult.data;

  try {
    const application = await prisma.application.findUnique({
      where: {
        id,
      },
    });

    if (!application) {
      response.status(404).json({
        message: 'Application not found.',
      });
      return;
    }

    const decision = await prisma.decision.upsert({
      where: {
        applicationId: id,
      },
      update: {
        status,
        decisionDate,
      },
      create: {
        applicationId: id,
        status,
        decisionDate,
      },
    });

    response.json(decision);
  } catch {
    response.status(500).json({
      message: 'Failed to save decision.',
    });
  }
});

export default decisionsRouter;
