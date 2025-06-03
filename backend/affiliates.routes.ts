import { Router, Request, Response } from 'express';
import { PrismaClient } from './generated/prisma';

const router = Router();
const prisma = new PrismaClient();

// Get all affiliates
router.get('/', async (_req: Request, res: Response) => {
  const affiliates = await prisma.affiliate.findMany();
  res.json(affiliates);
});

// Get affiliate by ID
router.get('/:id', async (req: Request, res: Response) => {
  const affiliate = await prisma.affiliate.findUnique({ where: { affiliateID: req.params.id } });
  if (!affiliate) return res.status(404).json({ error: 'Affiliate not found' });
  res.json(affiliate);
});

// Create affiliate
router.post('/', async (req: Request, res: Response) => {
  try {
    const affiliate = await prisma.affiliate.create({ data: req.body });
    res.status(201).json(affiliate);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create affiliate', details: err });
  }
});

// Update affiliate
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const affiliate = await prisma.affiliate.update({ where: { affiliateID: req.params.id }, data: req.body });
    res.json(affiliate);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update affiliate', details: err });
  }
});

// Delete affiliate
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await prisma.affiliate.delete({ where: { affiliateID: req.params.id } });
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete affiliate', details: err });
  }
});

export default router; 