const Server = require('../models/serverModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.checkServerAuthority = catchAsync(async (req, res, next) => {
  const server = await Server.findOne({ slug: req.params.serverSlug });

  if (!server) return next(new AppError('Server does not exist!'));

  if (!req.user._id.equals(server.author._id)) {
    return next(
      new AppError('You can only make changes to your own server!', 400)
    );
  }
  next();
});
