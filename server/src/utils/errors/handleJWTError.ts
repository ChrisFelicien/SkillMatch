import AppError from '@/utils/AppError';

const handleJWTError = (): AppError => {
  return new AppError('Invalid token. Please login again.', 401);
};

export default handleJWTError;
