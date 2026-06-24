import config from '@/config/env.config';
import { IJwtPayload } from '@/interfaces/IJwtPayLoad';
import { UserRoles } from '@/interfaces/IUser';
import User from '@/models/User.model';
import AppError from '@/utils/AppError';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

function isValidPayload(
  payload: string | jwt.JwtPayload,
): payload is IJwtPayload {
  return typeof payload === 'object' && payload !== null && 'userId' in payload;
}

class AuthMiddleware {
  protect = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const accessToken = req.cookies?.accessToken;

    if (!accessToken) {
      throw new AppError('No access provided.', 401);
    }

    const decoded = jwt.verify(accessToken, config.JWT_ACCESS_TOKEN_SECRET);

    if (!isValidPayload(decoded)) {
      return next(
        new AppError('Malicious or corrupted token payload structure', 401),
      );
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new AppError('No user found with this id token', 404);
    }
    if (decoded.iat) {
      const isPasswordChanged = user.passwordChangedAfterTokenIssued(
        decoded.iat,
      );

      if (isPasswordChanged) {
        throw new AppError(
          'User recently changed password. Please log in again.',
          401,
        );
      }
    }

    req.user = user;

    return next();
  };

  restrictTo(roles: UserRoles[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!req.user) {
        return next(new AppError('You are not authenticated.', 401));
      }
      if (!roles.includes(req.user.role)) {
        return next(
          new AppError('You are not allowed to perform this action', 403),
        );
      }

      next();
    };
  }
}

export default new AuthMiddleware();
