const AppError = require('../../utils/appError');

const handleValidationError = err => {
  const errors = Object.keys(err.errors).map(e => err.errors[e]);
  return new AppError('Invalid data!', 400, errors);
};

const handleDuplicateKeyError = err => {
  const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
  const message = `${value}: already exist!`;
  return new AppError(message, 400);
};

const sendError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    name: err.name,
    code: err.code,
    errors: err.errorArray,
    message: err.message,
    stack: err.stack,
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  let error;
  error = Object.assign(err, error);

  if (error.name === 'ValidationError') error = handleValidationError(error);
  if (error.code === 11000) error = handleDuplicateKeyError(error);

  sendError(error, res);
};
