import { Router, Request, Response } from 'express';
import { PrismaClient } from './generated/prisma';

const router = Router();
const prisma = new PrismaClient();

// Get all user profiles
router.get('/', async (_req: Request, res: Response) => {
  const profiles = await prisma.userProfile.findMany();
  res.json(profiles);
});

// Get user profile by ID
router.get('/:id', async (req: Request, res: Response) => {
  const profile = await prisma.userProfile.findUnique({ where: { id: req.params.id } });
  if (!profile) return res.status(404).json({ error: 'UserProfile not found' });
  res.json(profile);
});

// Create user profile
router.post('/', async (req: Request, res: Response) => {
  try {
    const profile = await prisma.userProfile.create({ data: req.body });
    res.status(201).json(profile);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create user profile', details: err });
  }
});

// Update user profile
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const profile = await prisma.userProfile.update({ where: { id: req.params.id }, data: req.body });
    res.json(profile);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update user profile', details: err });
  }
});

// Delete user profile
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await prisma.userProfile.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete user profile', details: err });
  }
});

export default router; 