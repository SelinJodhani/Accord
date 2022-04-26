const createError = require('http-errors');

const User = require('../models/User');
const catchAsync = require('../utils/catch.async');
const { deleteUser } = require('../utils/delete.cascade');

exports.get = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-servers');

  if (!user) return next(new createError(400, 'User doesn not exist!'));

  return res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.find = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id)
    .populate({
      path: 'servers',
      select: '-__v -users -createdAt',
    })
    .select('-__v');

  return res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.search = catchAsync(async (req, res, next) => {
  const { search } = req.query;

  const users = await User.find({ name: { $regex: search, $options: 'i' } });

  return res.status(200).json({
    status: 'success',
    data: {
      users,
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
      image: req.image ? req.image : undefined,
    },
    {
      new: false,
      runValidators: true,
    }
  );

  return res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.delete = catchAsync(async (req, res, next) => {
  await deleteUser(req.user._id);

  return res.status(204).json({
    status: 'success',
    data: null,
  });
});
