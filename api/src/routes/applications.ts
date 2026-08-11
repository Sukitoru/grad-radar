import express from 'express';
import prisma from '../db.ts';

const router = express.Router();

// Creates the application 

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

// Updates the application by the signed in user 

router.put('applications/:id', async (req, res) => {
    const {
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
    const userId = (req as any).user.id;
    const application = await prisma.application.findUnique ({
      where: {
        id: req.params.id,
      },
    });

    if (!application) {
      return res.status(404).json ({
        message: 'Application not found.',
      });
    }

    if (application.userId !== userId)
    {
      return res.status(403).json ({
        message: 'You are not authorized to update this application.',
      });
    }

    const updatedApplication = await prisma.application.update ({
      where: {
        id: req.params.id,
      },
      data: {
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

    res.json(updatedApplication);
  } catch {
    res.status(500).json({
      message: 'Failed to update application.',
    });
  }
});

// Delete one application by ID.

router.delete('/applications/:id', async (req, res) => {
  try {
    const  userId = (req as any).user.id;
    const application = await prisma.application.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!application) {
      res.status(404).json({
        message: 'Application not found.',
      });
      return;
    }

    if (!application.userId !== userId) {
      return res.status(403).json ({
        message: 'You are not authorized delete this application.',
      });
    }

    await prisma.application.delete({
      where: {
        id: req.params.id,
      },
    });

    res.json({
      message: 'Application deleted successfully.',
    });
  } catch {
    res.status(500).json({
      message: 'Failed to delete application.',
    });
  }
});

export default router;
