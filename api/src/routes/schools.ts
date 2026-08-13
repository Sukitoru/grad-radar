import express from 'express';
import { z } from 'zod';
import prisma from '../db.ts';
import { schoolRequestSchema } from '../schemas/school.ts';

const router = express.Router();

router.get('/schools', async (_request, response) => {
  try {
    const schools = await prisma.school.findMany({
      orderBy: {
        name: 'asc',
      },
      select: {
        id: true,
        name: true,
      },
    });

    response.json(schools);
  } catch {
    response.status(500).json({
      message: 'Failed to get schools.',
    });
  }
});

router.post('/schools', async (request, response) => {
  const validationResult = schoolRequestSchema.safeParse(request.body);
  if (!validationResult.success) {
    response.status(400).json({
      message: 'Invalid school data.',
      errors: z.flattenError(validationResult.error).fieldErrors,
    });
    return;
  }

  const { name } = validationResult.data;

  try {
    const school = await prisma.school.create({
      data: {
        name,
      },
    });

    response.status(201).json(school);
  } catch {
    response.status(500).json({
      message: 'Failed to create school.',
    });
  }
});

router.patch('/schools/:id', async (request, response) => {
  const { id } = request.params;
  const validationResult = schoolRequestSchema.safeParse(request.body);

  if (!validationResult.success) {
    response.status(400).json({
      message: 'Invalid school data.',
      errors: z.flattenError(validationResult.error).fieldErrors,
    });
    return;
  }

  const { name } = validationResult.data;

  try {
    const school = await prisma.school.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });

    response.json(school);
  } catch {
    response.status(500).json({
      message: 'Failed to update school.',
    });
  }
});

router.delete('/schools/:id', async (request, response) => {
  const { id } = request.params;

  try {
    await prisma.school.delete({
      where: {
        id,
      },
    });

    response.status(204).send();
  } catch {
    response.status(500).json({
      message: 'Failed to delete school.',
    });
  }
});

export default router;
