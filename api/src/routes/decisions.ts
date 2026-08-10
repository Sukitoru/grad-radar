import express from 'express';
import prisma from '../db.ts';
import { updateDecisionSchema } from '../schemas/decision.ts';

const router = express.Router();

router.put('/applications/:id/decision', async (request, response) => {
  const validationResult = updateDecisionSchema.safeParse(request.body);

  if (!validationResult.success) {
    response.status(400).json({
      message: 'Invalid decision data.',
      errors: validationResult.error.flatten().fieldErrors,
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

export default router;
