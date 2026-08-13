import express from 'express';
import prisma from '../db.ts';

const usersRouter = express.Router();

const profileFields = {
  id: true,
  username: true,
  defaultGpa: true,
  defaultAwards: true,
  defaultPublications: true,
  defaultPublicationLinks: true,
};

usersRouter.get('/users/:id/profile', async (request, response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: request.params.id },
      select: profileFields,
    });

    if (!user) {
      response.status(404).json({ message: 'User not found.' });
      return;
    }

    response.json(user);
  } catch {
    response.status(500).json({ message: 'Failed to retrieve account profile.' });
  }
});

usersRouter.patch('/users/:id/profile', async (request, response) => {
  const {
    username,
    defaultGpa,
    defaultAwards,
    defaultPublications,
    defaultPublicationLinks,
  } = request.body;

  if (!username || username.trim().length < 3) {
    response.status(400).json({
      message: 'Username must be at least 3 characters.',
    });
    return;
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: request.params.id },
    });

    if (!existingUser) {
      response.status(404).json({ message: 'User not found.' });
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { id: request.params.id },
      data: {
        username: username.trim(),
        defaultGpa,
        defaultAwards,
        defaultPublications,
        defaultPublicationLinks,
      },
      select: profileFields,
    });

    response.json(updatedUser);
  } catch {
    response.status(500).json({
      message: 'Failed to update account profile. The username may already be taken.',
    });
  }
});

export default usersRouter;
