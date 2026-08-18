import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '../generated/prisma/client.ts';
import { PrismaPg } from '@prisma/adapter-pg';
import {
  changePasswordSchema,
  loginSchema,
  registerSchema,
} from '../schemas/auth.ts';
import {
  requireAuth,
  type AuthenticatedRequest,
} from '../middleware/requireAuth.ts';

const authRouter = express.Router();
const connectionString = process.env.DATABASE_URL;
const jwtSecret = process.env.JWT_SECRET ?? 'grad-radar-local-demo-secret';

if (!connectionString) {
  throw new Error('DATABASE_URL is required.');
}

const databaseAdapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter: databaseAdapter });

authRouter.post('/register', async (request, response) => {
  const validationResult = registerSchema.safeParse(request.body);

  if (!validationResult.success) {
    response.status(400).json({
      message: validationResult.error.issues[0]?.message ?? 'Invalid account.',
    });
    return;
  }

  const { username, password } = validationResult.data;
  const existingUser = await prisma.user.findUnique({ where: { username } });

  if (existingUser) {
    response.status(409).json({ message: 'This username is already taken.' });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { username, passwordHash },
  });
  const token = jwt.sign({ id: user.id, username: user.username }, jwtSecret, {
    expiresIn: '24h',
  });

  response.status(201).json({
    message: 'Account created successfully.',
    token,
    user: { id: user.id, username: user.username },
  });
});

authRouter.post('/login', async (request, response) => {
  const validationResult = loginSchema.safeParse(request.body);

  if (!validationResult.success) {
    response.status(400).json({
      message: validationResult.error.issues[0]?.message ?? 'Invalid login.',
    });
    return;
  }

  const { username, password } = validationResult.data;
  const user = await prisma.user.findUnique({ where: { username } });
  const passwordMatches = user
    ? await bcrypt.compare(password, user.passwordHash)
    : false;

  if (!user || !passwordMatches) {
    response.status(401).json({ message: 'Invalid username or password.' });
    return;
  }

  const token = jwt.sign({ id: user.id, username: user.username }, jwtSecret, {
    expiresIn: '24h',
  });

  response.json({
    message: 'Logged in successfully.',
    token,
    user: { id: user.id, username: user.username },
  });
});

authRouter.get(
  '/me',
  requireAuth,
  (request: AuthenticatedRequest, response) => {
    response.json({ user: request.user });
  },
);

authRouter.patch(
  '/password',
  requireAuth,
  async (request: AuthenticatedRequest, response) => {
    const validationResult = changePasswordSchema.safeParse(request.body);

    if (!validationResult.success) {
      response.status(400).json({
        message:
          validationResult.error.issues[0]?.message ?? 'Invalid password.',
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: request.user?.id },
    });

    if (!user) {
      response.status(404).json({ message: 'Account not found.' });
      return;
    }

    const { currentPassword, newPassword } = validationResult.data;
    const passwordMatches = await bcrypt.compare(
      currentPassword,
      user.passwordHash,
    );

    if (!passwordMatches) {
      response.status(401).json({ message: 'Current password is incorrect.' });
      return;
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    response.json({ message: 'Password updated successfully.' });
  },
);

authRouter.post('/logout', (_request, response) => {
  response.status(204).send();
});

export default authRouter;
