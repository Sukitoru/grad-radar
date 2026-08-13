import express from 'express';
import { z } from 'zod';
import prisma from '../db.ts';
import { termRequestSchema } from '../schemas/term.ts';

const router = express.Router();

router.get('/terms', async (_request, response) => {
  try {
    const terms = await prisma.term.findMany({
      orderBy: [
        {
          academicYear: 'desc',
        },
        {
          name: 'asc',
        },
      ],
      select: {
        id: true,
        name: true,
        academicYear: true,
        startDate: true,
        endDate: true,
      },
    });

    response.json(terms);
  } catch {
    response.status(500).json({
      message: 'Failed to get terms.',
    });
  }
});

router.post('/terms', async (request, response) => {
  const validationResult = termRequestSchema.safeParse(request.body);

  if (!validationResult.success) {
    response.status(400).json({
      message: 'Invalid term data.',
      errors: z.flattenError(validationResult.error).fieldErrors,
    });
    return;
  }

  const { name, academicYear } = validationResult.data;

  try {
    const term = await prisma.term.create({
      data: {
        name,
        academicYear,
      },
    });

    response.status(201).json(term);
  } catch {
    response.status(500).json({
      message: 'Failed to create term.',
    });
  }
});

router.patch('/terms/:id', async (request, response) => {
  const { id } = request.params;
  const validationResult = termRequestSchema.safeParse(request.body);

  if (!validationResult.success) {
    response.status(400).json({
      message: 'Invalid term data.',
      errors: z.flattenError(validationResult.error).fieldErrors,
    });
    return;
  }

  const { name, academicYear } = validationResult.data;

  try {
    const term = await prisma.term.update({
      where: {
        id,
      },
      data: {
        name,
        academicYear,
      },
    });

    response.json(term);
  } catch {
    response.status(500).json({
      message: 'Failed to update term.',
    });
  }
});

router.delete('/terms/:id', async (request, response) => {
  const { id } = request.params;

  try {
    await prisma.term.delete({
      where: {
        id,
      },
    });

    response.status(204).send();
  } catch {
    response.status(500).json({
      message: 'Failed to delete term.',
    });
  }
});

export default router;
