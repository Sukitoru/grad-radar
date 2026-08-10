import express from 'express';
import { PrismaClient } from '../generated/prisma/client.ts';
import { PrismaPg } from '@prisma/adapter-pg';
import { updateDecisionSchema } from '../schemas/decision'; // Import the Zod validation schema

const router = express.Router();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is required.');
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

/**
 * @route   POST /applications
 * @desc    Create a new graduate school application
 */

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

/**
 * @route   PUT /applications/:id/decision
 * @desc    Save or update (upsert) an admission decision for a specific application
 */
router.put('/applications/:id/decision', async (req, res): Promise<any> => {
  const { id } = req.params; // This is the applicationId

  try {
    // 1. Validate the incoming request body using Zod
    const validationResult = updateDecisionSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({
        error: "Validation Failed",
        details: validationResult.error.flatten().fieldErrors,
      });
    }

    const { status, decisionDate } = validationResult.data;

    // 2. Ensure the parent application exists before trying to attach a decision
    const existingApplication = await prisma.application.findUnique({
      where: { id },
    });

    if (!existingApplication) {
      return res.status(404).json({ error: "Application record not found." });
    }

    // 3. Upsert (Update existing OR Create new) the decision record in PostgreSQL
    const savedDecision = await prisma.decision.upsert({
      where: { applicationId: id },
      update: {
        status,
        decisionDate,
      },
      create: {
        applicationId: id,
        status,
        decisionDate,
      },
    });

    return res.status(200).json({
      message: "Decision saved successfully.",
      decision: savedDecision,
    });

  } catch (error: any) {
    console.error("Error saving application decision:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "An unexpected database error occurred while saving the decision."
    });
  }
});

export default router;
