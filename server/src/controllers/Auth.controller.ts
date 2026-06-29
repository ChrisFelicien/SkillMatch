import { NextFunction, Request, Response } from 'express';
import AuthService from '@/services/Auth.service';
import IUser, { UserRoles } from '@/interfaces/IUser';
import config from '@/config/env.config';

const createSessionResponse = (
  res: Response,
  statusCode: number,
  message: string,
  accessToken: string,
  refreshToken: string,
  user: IUser,
) => {
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  });

  return res.status(statusCode).json({
    success: true,
    message,
    user,
  });
};

class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    const { confirmPassword, ...userData } = req.body;

    const data = { ...userData, role: UserRoles.FREELANCER };

    const { user, accessToken, refreshToken } =
      await AuthService.register(data);

    return createSessionResponse(
      res,
      201,
      'Account created',
      accessToken,
      refreshToken,
      user,
    );
  }

  async login(req: Request, res: Response, next: NextFunction) {
    const userData = req.body;

    const { user, accessToken, refreshToken } = await AuthService.login({
      email: userData.email,
      password: userData.password,
    });

    return createSessionResponse(
      res,
      200,
      'Login successfully',
      accessToken,
      refreshToken,
      user,
    );
  }

  async userProfile(req: Request, res: Response, next: NextFunction) {
    res.status(200).json({
      success: 'true',
      message: 'User profile',
      user: req.user,
    });
  }
}

export default new AuthController();
