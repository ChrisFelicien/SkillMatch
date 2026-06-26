import express, { Express, NextFunction, Request, Response } from 'express';
import authRouter from '@/routes/v1/Auth.route';
import AppError from './utils/AppError';
import globalErrorHandler from '@/middlewares/globalErrorHandler';

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

app.all(/.*/, (req: Request, res: Response, next: NextFunction) => {
  throw new AppError(
    `This ${req.originalUrl} is not defined in this server`,
    404,
  );
});

app.use(globalErrorHandler);

export default app;
