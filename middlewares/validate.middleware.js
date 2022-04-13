const createError = require('http-errors');

exports.validator = schema => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) return next(new createError(400, error.details[0].message));
    next();
  };
};
