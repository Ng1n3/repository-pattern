import * as dotenv from 'dotenv';
import express, { Application, Request, Response } from 'express';
import { AppDataSource } from '../drizzle.config';
import userRouter from './user/user.routes';
import { sql } from 'drizzle-orm';
dotenv.config();

const app: Application = express();
const PORT: number = +process.env.PORT! || 5000;

app.use(express.json());

app.use('/api/v1/users', userRouter);

app.get('/api/v1/healthcheck', (req: Request, res: Response) => {
  res.send({ status: 'Server is healthy' });
});

async function initializeDB() {
  try {
    await AppDataSource.execute(sql `SELECT 1`);
    console.log('Database connectino established');
  } catch (error: any) {
    console.error('Database connection failed', error);
    process.exit(1);
  }
}

initializeDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Database connection closed');
  process.exit(0);
});
