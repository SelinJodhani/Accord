const createError = require('http-errors');

const handleValidationError = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `${errors[0]}`;
  return new createError(400, message);
};

const handleDuplicateKeyError = err => {
  const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
  const message = `${value}: already exist!`;
  return new createError(400, message);
};

const handleLimitFileSize = err => {
  const message = 'File Size is too large. Max Allowed file size is 3 mb.';
  return new createError(400, message);
};

const sendError = (err, res) => {
  return res.status(err.statusCode).json({
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
  if (error.code == 'LIMIT_FILE_SIZE') error = handleLimitFileSize(error);
  if (error.code === 11000) error = handleDuplicateKeyError(error);

  sendError(error, res);
};
