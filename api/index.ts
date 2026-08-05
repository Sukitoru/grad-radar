import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

//---Routes---

/* Creates an application */

router.post("/applications", async (req, res) => {
    try {
        const application = await prisma.application.create({
            data: req.body,
        });

        res.status(201).json(application);
    } catch (error) {
        res.status(500).json({ 
            message: "Failed to create application.",
        });
    }
});

export default router; 

