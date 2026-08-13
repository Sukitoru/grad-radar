import express from 'express';
import { z } from 'zod';
import prisma from '../db.ts';
import { programRequestSchema } from '../schemas/program.ts';

const router = express.Router();

router.get('/programs', async (_request, response) => {
  try {
    const programs = await prisma.program.findMany({
      orderBy: {
        name: 'asc',
      },
      select: {
        id: true,
        schoolId: true,
        name: true,
        degreeLevel: true,
      },
    });
    response.json(programs);
  } catch {
    response.status(500).json({
      message: 'Failed to get programs.',
    });
  }
});

router.post('/programs', async (request, response) => {
  const validationResult = programRequestSchema.safeParse(request.body);

  if (!validationResult.success) {
    response.status(400).json({
      message: 'Invalid program data.',
      errors: z.flattenError(validationResult.error).fieldErrors,
    });
    return;
  }

  const { schoolId, name, degreeLevel } = validationResult.data;
  try {
    const program = await prisma.program.create({
      data: {
        schoolId,
        name,
        degreeLevel,
      },
    });

    response.status(201).json(program);
  } catch {
    response.status(500).json({
      message: 'Failed to create program.',
    });
  }
});

router.patch('/programs/:id', async (request, response) => {
  const { id } = request.params;
  const validationResult = programRequestSchema.safeParse(request.body);

  if (!validationResult.success) {
    response.status(400).json({
      message: 'Invalid program data.',
      errors: z.flattenError(validationResult.error).fieldErrors,
    });
    return;
  }

  const { schoolId, name, degreeLevel } = validationResult.data;

  try {
    const program = await prisma.program.update({
      where: {
        id,
      },
      data: {
        schoolId,
        name,
        degreeLevel,
      },
    });

    response.json(program);
  } catch {
    response.status(500).json({
      message: 'Failed to update program.',
    });
  }
});

router.delete('/programs/:id', async (request, response) => {
  const { id } = request.params;

  try {
    await prisma.program.delete({
      where: {
        id,
      },
    });

    response.status(204).send();
  } catch {
    response.status(500).json({
      message: 'Failed to delete program.',
    });
  }
});

export default router;
