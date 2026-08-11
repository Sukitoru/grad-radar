import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '../generated/prisma/client.ts';
import { PrismaPg } from '@prisma/adapter-pg';
import { registerSchema, loginSchema } from '../schemas/auth.ts';
import { requireAuth, type AuthenticatedRequest } from '../middleware/auth.ts';

const router = express.Router();

const connectionString = process.env.DATABASE_URL;
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-gradradar-key';

if (!connectionString) {
  throw new Error('DATABASE_URL is required.');
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

/**
 * @route   POST /auth/register
 * @desc    Create a new user account with hashed password protection
 */
router.post('/register', async (req, res): Promise<any> => {
  try {
    // 1. Validate incoming body variables with Zod
    const validationResult = registerSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation Failed',
        details: validationResult.error.flatten().fieldErrors,
      });
    }

    const { username, password } = validationResult.data;

    // 2. Check if username is already taken in PostgreSQL
    const existingUser = await prisma.user.findUnique({
      where: { username }
    });

    if (existingUser) {
      return res.status(409).json({
        error: 'Conflict',
        message: 'This username is already taken.'
      });
    }

    // 3. Hash the plain text password securely using bcrypt (10 salt rounds)
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 4. Write new User record to the database via Prisma
    const newUser = await prisma.user.create({
      data: {
        username,
        passwordHash
      }
    });

    // 5. Generate short-lived JWT token (expires in 24 hours)
    const token = jwt.sign(
      { id: newUser.id, username: newUser.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return profile data and session token (exclude passwordHash from response!)
    return res.status(201).json({
      message: 'Account created successfully.',
      token,
      user: {
        id: newUser.id,
        username: newUser.username
      }
    });

  } catch (error) {
    console.error('Error during registration:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to complete registration.'
    });
  }
});

/**
 * @route   POST /auth/login
 * @desc    Authenticate user credentials, return signed JWT session token
 */
router.post('/login', async (req, res): Promise<any> => {
  try {
    // 1. Validate login variables with Zod
    const validationResult = loginSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation Failed',
        details: validationResult.error.flatten().fieldErrors,
      });
    }

    const { username, password } = validationResult.data;

    // 2. Query user record from database
    const user = await prisma.user.findUnique({
      where: { username }
    });

    if (!user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid username or password.'
      });
    }

    // 3. Compare inputted password with the secure hash stored in Postgres
    const isPasswordMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordMatch) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid username or password.'
      });
    }

    // 4. Sign session token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      message: 'Logged in successfully.',
      token,
      user: {
        id: user.id,
        username: user.username
      }
    });

  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred during login.'
    });
  }
});

/**
 * @route   GET /auth/me
 * @desc    Fetch profile details of the currently authenticated user session
 */
router.get('/me', requireAuth, async (req: AuthenticatedRequest, res): Promise<any> => {
  return res.status(200).json({
    user: req.user
  });
});

// Temporary endpoint until logout logic is added.
router.post('/logout', (_request, response) => {
  response.status(501).json({
    message: 'Logout is in development.',
  });
});

export default router;
