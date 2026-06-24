import AuthController from '@/controllers/Auth.controller';
import AuthMiddleware from '@/middlewares/Auth.middleware';
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

router.get(
  '/me',
  catchAsyncError(AuthMiddleware.protect),
  AuthController.userProfile,
);

export default router;
