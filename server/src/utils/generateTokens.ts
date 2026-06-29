import config from '@/config/env.config';
import { IJwtPayload } from '@/interfaces/IJwtPayLoad';
import * as jwt from 'jsonwebtoken';

export const generateAccessToken = (payload: IJwtPayload): string => {
  return jwt.sign(
    { userId: payload.userId, role: payload.role },
    config.JWT_ACCESS_TOKEN_SECRET,
    {
      expiresIn: '15m',
    },
  );
};

export const generateRefreshToken = (payload: IJwtPayload): string => {
  return jwt.sign(
    { userId: payload.userId, role: payload.role, jwt: crypto.randomUUID() },
    config.JWT_REFRESH_TOKEN_SECRET,
    {
      expiresIn: '7d',
    },
  );
};
