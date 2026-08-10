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

/**
 * @route   GET /users/me/profile
 * @desc    Fetch profile stats for the logged-in user
 * @access  Private (Ensure your authentication middleware is applied!)
 */
router.get('/users/me/profile', async (req, res): Promise<any> => {
  try {
    // In a real application, you obtain the logged-in userId from your auth token middleware (e.g., req.user.id)
    // For local development and testing, we fallback to a query parameter or header if no auth middleware is active yet
    const userId = (req.headers['x-user-id'] || req.query.userId) as string;

    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "No user identification found. Pass 'x-user-id' in headers or run through auth middleware."
      });
    }

    // Retrieve user and sum up relevant application stats
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User profile not found." });
    }

    // Fetch user's applications to extract academic metrics (GPA/GRE/Publications/Research Area)
    const applications = await prisma.application.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 1, // Look at their most recent submission to fill profile stats
    });

    const latestApp = applications[0] || null;

    return res.status(200).json({
      id: user.id,
      username: user.username,
      gpa: latestApp?.gpa ? parseFloat(latestApp.gpa.toString()) : null,
      greVerbal: latestApp?.greVerbal || null,
      greQuantitative: latestApp?.greQuantitative || null,
      greWriting: latestApp?.greWriting ? parseFloat(latestApp.greWriting.toString()) : null,
      researchArea: latestApp?.researchArea || "Not specified",
      publications: latestApp?.publications || 0,
    });

  } catch (error: any) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "An unexpected database error occurred while fetching your profile."
    });
  }
});

/**
 * @route   GET /users/me/applications
 * @desc    Fetch all tracked applications for the logged-in user (including decision outcomes)
 * @access  Private
 */
router.get('/users/me/applications', async (req, res): Promise<any> => {
  try {
    const userId = (req.headers['x-user-id'] || req.query.userId) as string;

    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "No user identification found. Pass 'x-user-id' in headers or run through auth middleware."
      });
    }

    // Fetch applications and include relation records for schools, programs, terms, and decisions
    const userApplications = await prisma.application.findMany({
      where: { userId },
      include: {
        school: {
          select: { name: true }
        },
        program: {
          select: { name: true, degreeLevel: true }
        },
        term: {
          select: { name: true, academicYear: true }
        },
        decision: {
          select: {
            id: true,
            status: true,
            decisionDate: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.status(200).json(userApplications);

  } catch (error: any) {
    console.error("Error fetching user applications:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "An unexpected database error occurred while fetching your tracked applications."
    });
  }
});

export default router;
