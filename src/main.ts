import * as dotenv from 'dotenv';
import express, { Application, Request, Response } from 'express';
import { AppDataSource } from './data-source';
import userRouter from './user/user.routes';
dotenv.config();

const app: Application = express();
const PORT: number = +process.env.PORT! || 5000;

app.use(express.json());

app.use('/api/v1/users', userRouter)

app.get('/api/v1/healthcheck', (req: Request, res: Response) => {
  res.send({ status: 'Server is healthy' });
});

AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection failed', error);
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGTERM', () => {
  AppDataSource.destroy().then(() => {
    console.log('Database connection closed');
    process.exit(0);
  });
});