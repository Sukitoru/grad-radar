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
    publicationLinks,
    comments,
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
        publicationLinks,
        comments,
        submissionDate: submissionDate ? new Date(submissionDate) : null,
      },
      include: {
        school: true,
        program: true,
        term: true,
        decision: true,
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
    const applications = await prisma.application.findMany({
      include: {
        school: true,
        program: true,
        term: true,
        decision: true,
      },
    });

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
      include: {
        school: true,
        program: true,
        term: true,
        decision: true,
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

// Update one application by ID.
router.put('/applications/:id', async (request, response) => {
  const {
    schoolId,
    programId,
    termId,
    gpa,
    researchArea,
    awards,
    publications,
    publicationLinks,
    comments,
    submissionDate,
  } = request.body;

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

    const updatedApplication = await prisma.application.update({
      where: {
        id: request.params.id,
      },
      data: {
        schoolId,
        programId,
        termId,
        gpa,
        researchArea,
        awards,
        publications,
        publicationLinks,
        comments,
        submissionDate: submissionDate ? new Date(submissionDate) : null,
      },
      include: {
        school: true,
        program: true,
        term: true,
        decision: true,
      },
    });

    response.json(updatedApplication);
  } catch {
    response.status(500).json({
      message: 'Failed to update application.',
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
