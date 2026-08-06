import express from 'express';
import { PrismaClient } from '../generated/prisma/client.ts';
import { PrismaPg } from '@prisma/adapter-pg';

const router = express.Router();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is required.');
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

router.post('/applications', async (req, res) => {
  const {
    userId,
    schoolId,
    programId,
    termId,
    gpa,
    greVerbal,
    greQuantitative,
    greWriting,
    researchArea,
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
        greVerbal,
        greQuantitative,
        greWriting,
        researchArea,
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
