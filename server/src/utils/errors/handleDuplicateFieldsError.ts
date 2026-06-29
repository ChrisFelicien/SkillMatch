import AppError from '@/utils/AppError';

const handleDuplicateFieldsError = (error: any) => {
  const field = Object.keys(error.keyValue)[0];

  return new AppError(
    `${field} already exists. Please use another value.`,
    409,
  );
};

export default handleDuplicateFieldsError;
