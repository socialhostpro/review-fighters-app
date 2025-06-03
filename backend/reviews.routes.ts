import { Router, Request, Response } from 'express';
import { PrismaClient } from './generated/prisma';

const router = Router();
const prisma = new PrismaClient();

// Get all reviews
router.get('/', async (_req: Request, res: Response) => {
  const reviews = await prisma.review.findMany();
  res.json(reviews);
});

// Get review by ID
router.get('/:id', async (req: Request, res: Response) => {
  const review = await prisma.review.findUnique({ where: { id: req.params.id } });
  if (!review) return res.status(404).json({ error: 'Review not found' });
  res.json(review);
});

// Create review
router.post('/', async (req: Request, res: Response) => {
  try {
    const review = await prisma.review.create({ data: req.body });
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create review', details: err });
  }
});

// Update review
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const review = await prisma.review.update({ where: { id: req.params.id }, data: req.body });
    res.json(review);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update review', details: err });
  }
});

// Delete review
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await prisma.review.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete review', details: err });
  }
});

export default router; 