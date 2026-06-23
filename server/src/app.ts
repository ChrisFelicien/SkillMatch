import express, { Express, NextFunction, Request, Response } from 'express';
import authRouter from '@/routes/v1/Auth.route';

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/health', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    status: 'Ok',
    message: 'The API is working',
  });
});

export default app;
