import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from './generated/prisma';
import usersRouter from './users.routes';
import userProfilesRouter from './userProfiles.routes';
import reviewsRouter from './reviews.routes';
import affiliatesRouter from './affiliates.routes';
import staffMembersRouter from './staffMembers.routes';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Sample users route (empty for now)
app.get('/users', async (_req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.use('/users', usersRouter);
app.use('/userProfiles', userProfilesRouter);
app.use('/reviews', reviewsRouter);
app.use('/affiliates', affiliatesRouter);
app.use('/staffMembers', staffMembersRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 