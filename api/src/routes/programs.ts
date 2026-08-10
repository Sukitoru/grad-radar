import express from 'express';
import prisma from '../db.ts';

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
  const { schoolId, name, degreeLevel } = request.body;

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
  const { schoolId, name, degreeLevel } = request.body;

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
