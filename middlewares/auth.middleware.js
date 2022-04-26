const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const { promisify } = require('util');

const User = require('../models/User');
const catchAsync = require('../utils/catch.async');

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new createError(
        401,
        'You are not logged in! Please log in to get access.'
      )
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new createError(
        401,
        'The user belonging to this token does no longer exist.'
      )
    );
  }

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new createError(
        401,
        'User recently changed password! Please log in again.'
      )
    );
  }

  req.user = currentUser;
  next();
});
