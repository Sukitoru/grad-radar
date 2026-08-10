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

/* List all applications */

router.get("/applications", async (req, res) => {
    try {
        const applications = await prisma.application.findMany();

        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json ({
            message: "Failed to retrieve applications.",
        }); 
    }
}); 

/* Get's one application by ID */

router.get("/applications/:id", async (req, res) => {
    try {
        const application = await prisma.application.findUnique ({
            where: {
                id: req.params.id,
            },
        });

        if (!application) {
            return res.status(404).json ({
                error: "Application not found", 
            });
        }

        res.status(200).json(application);
    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve application.",
        });
    }
});

/* Deletes's an application*/

router.delete("/applications/:id", async (req, res) => {
    try {
        const application = await prisma.application.findUnique ({
            where: {
                id: req.params.id,
            },
        });

        if (!application) {
            return res.status(404).json({ 
                message: "Application not found.",
            });
        }

        await prisma.application.delete ({
            where: {
                id: req.params.id,
            },
        });

        res.status(200).json ({
            message: "Application deleted successfully",
        });
    } catch (error) {
        res.status(500).json ({
            message: "Failed to delete application.",
        });
    }
});

export default router;
