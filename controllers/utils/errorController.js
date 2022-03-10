const AppError = require('../../utils/appError');

const handleValidationError = err => {
  const errors = Object.keys(err.errors).map(e => e);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const sendError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    name: err.name,
    code: err.code,
    message: err.message,
    stack: err.stack,
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  let error = { ...err };
  error.name = err.name;

  if (error.name === 'ValidationError') error = handleValidationError(error);

  sendError(error, res);
};
