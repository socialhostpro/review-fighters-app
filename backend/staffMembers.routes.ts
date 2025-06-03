import { Router, Request, Response } from 'express';
import { PrismaClient } from './generated/prisma';

const router = Router();
const prisma = new PrismaClient();

// Get all staff members
router.get('/', async (_req: Request, res: Response) => {
  const staff = await prisma.staffMember.findMany();
  res.json(staff);
});

// Get staff member by ID
router.get('/:id', async (req: Request, res: Response) => {
  const staff = await prisma.staffMember.findUnique({ where: { staffId: req.params.id } });
  if (!staff) return res.status(404).json({ error: 'Staff member not found' });
  res.json(staff);
});

// Create staff member
router.post('/', async (req: Request, res: Response) => {
  try {
    const staff = await prisma.staffMember.create({ data: req.body });
    res.status(201).json(staff);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create staff member', details: err });
  }
});

// Update staff member
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const staff = await prisma.staffMember.update({ where: { staffId: req.params.id }, data: req.body });
    res.json(staff);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update staff member', details: err });
  }
});

// Delete staff member
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await prisma.staffMember.delete({ where: { staffId: req.params.id } });
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete staff member', details: err });
  }
});

export default router; 