import AppError from '@/utils/AppError';

const handleJWTExpiredError = (): AppError => {
  return new AppError('Your session has expired. Please login again.', 401);
};

export default handleJWTExpiredError;
