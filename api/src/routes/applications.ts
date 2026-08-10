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

export default router;
