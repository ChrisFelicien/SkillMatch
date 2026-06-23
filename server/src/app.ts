import express, { Express } from 'express';
import authRouter from '@/routes/v1/Auth.route';

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/api/v1/auth', authRouter);

export default app;
