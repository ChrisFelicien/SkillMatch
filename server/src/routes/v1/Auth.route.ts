import AuthController from '@/controllers/Auth.controller';
import validate from '@/middlewares/validate';
import { loginSchema, registerSchema } from '@/schemas/AuthSchema';
import catchAsyncError from '@/utils/catchAsyncError';
import { Router } from 'express';

const router: Router = Router();

router.post(
  '/register',
  validate(registerSchema),
  catchAsyncError(AuthController.register),
);
router.post(
  '/login',
  validate(loginSchema),
  catchAsyncError(AuthController.login),
);

router.get('/me', AuthController.userProfile);

export default router;
