import { Request, Response, NextFunction } from 'express';
import config from '@/config/env.config';
import AppError from '@/utils/AppError';
import handleDuplicateFieldsError from '@/utils/errors/handleDuplicateFieldsError';
import handleCastError from '@/utils/errors/handleCastError';
import handleValidationError from '@/utils/errors/handleValidationError';
import handleJWTError from '@/utils/errors/handleJWTError';
import handleJWTExpiredError from '@/utils/errors/handleJWTExpiredError';
import handleZodError from '@/utils/errors/handleZodError';

const sendDevError = (res: Response, error: AppError & { stack?: string }) => {
  return res.status(error.statusCode).json({
    success: false,
    status: error.status,
    message: error.message,
    stack: error.stack,
  });
};

const sendProdError = (res: Response, error: AppError) => {
  return res.status(error.statusCode).json({
    success: false,
    status: error.status,
    message: error.message,
  });
};

const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let err = error;

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (err.name === 'CastError') {
    err = handleCastError(err);
  }

  if (err.code === 11000) {
    err = handleDuplicateFieldsError(err);
  }

  if (err.name === 'ValidationError') {
    err = handleValidationError(err);
  }

  if (err.name === 'JsonWebTokenError') {
    err = handleJWTError();
  }

  if (err.name === 'TokenExpiredError') {
    err = handleJWTExpiredError();
  }

  if (err.name === 'ZodError') {
    err = handleZodError(err);
  }

  if (config.NODE_ENV === 'development' || config.NODE_ENV === 'test') {
    return sendDevError(res, err);
  }

  return sendProdError(res, err);
};

export default globalErrorHandler;
