const Server = require('../models/Server');
const catchAsync = require('../utils/catch.async');
const createError = require('http-errors');

exports.checkServerAuthority = catchAsync(async (req, res, next) => {
  const server = await Server.findOne({ slug: req.params.serverSlug });

  if (!server) return next(new AppError('Server does not exist!'));

  if (!req.user._id.equals(server.author._id)) {
    return next(
      new createError(400, 'You can only make changes to your own server!')
    );
  }
  next();
});
