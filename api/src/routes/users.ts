import express from 'express';
import prisma from '../db.ts';

const usersRouter = express.Router();

const allowedAwards = [
  'Honors',
  "Dean's List",
  'Academic Excellence',
  'Outstanding Student',
  'Research Award',
  'Merit Scholarship',
];

const profileFields = {
  id: true,
  username: true,
  defaultGpa: true,
  defaultAwards: true,
  defaultPublications: true,
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
  } = request.body;

  if (!username || username.trim().length < 3) {
    response.status(400).json({
      message: 'Username must be at least 3 characters.',
    });
    return;
  }

  const selectedAwards = Array.isArray(defaultAwards) ? defaultAwards : [];
  const publicationCount = Number(defaultPublications ?? 0);

  if (
    selectedAwards.length > 5 ||
    selectedAwards.some((award) => !allowedAwards.includes(award)) ||
    !Number.isInteger(publicationCount) ||
    publicationCount < 0 ||
    publicationCount > 100
  ) {
    response.status(400).json({
      message: 'Select up to 5 valid awards and enter 0 to 100 publications.',
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
        defaultAwards: selectedAwards,
        defaultPublications: publicationCount,
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
