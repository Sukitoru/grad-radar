import express from 'express';
import prisma from '../db.ts';

const router = express.Router();

const allowedAwards = [
  'Honors',
  "Dean's List",
  'Academic Excellence',
  'Outstanding Student',
  'Research Award',
  'Merit Scholarship',
];

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
    comments,
    submissionDate,
  } = req.body;

  const selectedAwards = Array.isArray(awards) ? awards : [];
  const publicationCount = Number(publications ?? 0);
  const savedResearchArea =
    typeof researchArea === 'string' ? researchArea.trim() : '';

  if (savedResearchArea.length > 255) {
    res.status(400).json({
      message: 'Research area must be 255 characters or fewer.',
    });
    return;
  }

  if (
    selectedAwards.length > 5 ||
    selectedAwards.some((award) => !allowedAwards.includes(award)) ||
    !Number.isInteger(publicationCount) ||
    publicationCount < 0 ||
    publicationCount > 100
  ) {
    res.status(400).json({
      message: 'Select up to 5 valid awards and enter 0 to 100 publications.',
    });
    return;
  }

  try {
    const application = await prisma.application.create({
      data: {
        userId,
        schoolId,
        programId,
        termId,
        gpa,
        researchArea: savedResearchArea || null,
        awards: selectedAwards,
        publications: publicationCount,
        comments,
        submissionDate: submissionDate ? new Date(submissionDate) : null,
      },
      include: {
        school: true,
        program: true,
        term: true,
        decision: {
          include: { waitlistUntilTerm: true },
        },
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
        decision: {
          include: { waitlistUntilTerm: true },
        },
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
        decision: {
          include: { waitlistUntilTerm: true },
        },
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
    comments,
    submissionDate,
  } = request.body;

  const selectedAwards = Array.isArray(awards) ? awards : [];
  const publicationCount = Number(publications ?? 0);
  const savedResearchArea =
    typeof researchArea === 'string' ? researchArea.trim() : '';

  if (savedResearchArea.length > 255) {
    response.status(400).json({
      message: 'Research area must be 255 characters or fewer.',
    });
    return;
  }

  if (
    selectedAwards.length > 5 ||
    selectedAwards.some((award) => !allowedAwards.includes(award)) ||
    !Number.isInteger(publicationCount) ||
    publicationCount < 0 ||
    publicationCount > 100
  ) {
    response.status(400).json({
      message: 'Select up to 5 valid awards and enter 0 to 100 publications.',
    });
    return;
  }

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
        researchArea: savedResearchArea || null,
        awards: selectedAwards,
        publications: publicationCount,
        comments,
        submissionDate: submissionDate ? new Date(submissionDate) : null,
      },
      include: {
        school: true,
        program: true,
        term: true,
        decision: {
          include: { waitlistUntilTerm: true },
        },
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
