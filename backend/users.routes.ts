import { Router, Request, Response } from 'express';
import { PrismaClient } from './generated/prisma';

const router = Router();
const prisma = new PrismaClient();

// Get all users
router.get('/', async (_req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

// Get user by ID
router.get('/:id', async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({ where: { id: req.params.id } });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// Create user
router.post('/', async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.create({ data: req.body });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create user', details: err });
  }
});

// Update user
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.update({ where: { id: req.params.id }, data: req.body });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update user', details: err });
  }
});

// Delete user
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete user', details: err });
  }
});

export default router; 