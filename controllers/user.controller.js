const fs = require('fs');
const createError = require('http-errors');

const User = require('../models/User');
const catchAsync = require('../utils/catch.async');

exports.find = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id)
    .populate({
      path: 'servers',
      select: '-__v -users -createdAt',
    })
    .select('-__v');

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.update = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new createError(
        400,
        'This route is not for password updates. Please use /updatePassword.'
      )
    );
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      image: req.file?.filename,
    },
    {
      new: false,
      runValidators: true,
    }
  );

  if (user.image !== 'Accord.png')
    await fs.promises.unlink(
      `${__dirname}/../public/images/users/${user.image}`
    );

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});
