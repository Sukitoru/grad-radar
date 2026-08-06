import express from "express";
/* import { PrismaClient } from "@prisma/client"; */
import { PrismaClient } from "./src/generated/prisma/index.js";
import { PrismaPg } from "@prisma/adapter-pg"; 
import pg from "pg"; 

const router = express.Router();

const pool = new pg.Pool ({
    connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient ({ adapter }); 

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

