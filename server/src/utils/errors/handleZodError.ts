import AppError from '@/utils/AppError';
import { ZodError } from 'zod';

const handleZodError = (error: ZodError): AppError => {
  const message = error.issues.map((issue) => issue.message).join(', ');

  return new AppError(message, 400);
};

export default handleZodError;
