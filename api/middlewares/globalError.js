const globalErrorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || `Something went wrong please try again later`;

  res.status(statusCode).json({
    status: err.status,
    message
  });
};

export default globalErrorMiddleware;
