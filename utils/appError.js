class AppError extends Error {
  constructor(message, statusCode, errorArray = undefined) {
    super(message);

    this.statusCode = statusCode;
    this.errorArray = errorArray;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
