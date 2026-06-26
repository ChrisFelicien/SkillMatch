import AppError from '@/utils/AppError';
import { Error as MongooseError } from 'mongoose';

const handleCastError = (error: MongooseError.CastError): AppError => {
  const message = `Invalid ${error.path}: ${error.value}`;

  return new AppError(message, 400);
};

export default handleCastError;
