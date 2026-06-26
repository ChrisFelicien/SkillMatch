import AppError from '@/utils/AppError';

const handleDuplicateFieldsError = (error: any) => {
  const field = Object.keys(error.keyValue)[0];
  let value;
  if (field) value = error.keyValue[field];

  return new AppError(
    `${field} "${value}" already exists. Please use another value.`,
    409,
  );
};

export default handleDuplicateFieldsError;
