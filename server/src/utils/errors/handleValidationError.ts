import AppError from '@/utils/AppError';
import { Error as MongooseError } from 'mongoose';

const handleValidationError = (
  error: MongooseError.ValidationError,
): AppError => {
  const errors = Object.values(error.errors)
    .map((err: any) => err.message)
    .join(', ');

  return new AppError(errors, 400);
};

export default handleValidationError;
