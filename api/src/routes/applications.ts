import express from 'express';
import prisma from '../db.ts';

const router = express.Router();

router.post('/applications', async (req, res) => {
  const {
    userId,
    schoolId,
    programId,
    termId,
    gpa,
    researchArea,
    awards,
    publications,
    submissionDate,
  } = req.body;

  try {
    const application = await prisma.application.create({
      data: {
        userId,
        schoolId,
        programId,
        termId,
        gpa,
        researchArea,
        awards,
        publications,
        submissionDate,
      },
    });

    res.status(201).json(application);
  } catch {
    res.status(500).json({
      message: 'Failed to create application.',
    });
  }
});

// List all applications.
router.get('/applications', async (_request, response) => {
  try {
    const applications = await prisma.application.findMany();

    response.json(applications);
  } catch {
    response.status(500).json({
      message: 'Failed to retrieve applications.',
    });
  }
});

// Get one application by ID.
router.get('/applications/:id', async (request, response) => {
  try {
    const application = await prisma.application.findUnique({
      where: {
        id: request.params.id,
      },
    });

    if (!application) {
      response.status(404).json({
        message: 'Application not found.',
      });
      return;
    }

    response.json(application);
  } catch {
    response.status(500).json({
      message: 'Failed to retrieve application.',
    });
  }
});

// Delete one application by ID.
router.delete('/applications/:id', async (request, response) => {
  try {
    const application = await prisma.application.findUnique({
      where: {
        id: request.params.id,
      },
    });

    if (!application) {
      response.status(404).json({
        message: 'Application not found.',
      });
      return;
    }

    await prisma.application.delete({
      where: {
        id: request.params.id,
      },
    });

    response.json({
      message: 'Application deleted successfully.',
    });
  } catch {
    response.status(500).json({
      message: 'Failed to delete application.',
    });
  }
});

export default router;
