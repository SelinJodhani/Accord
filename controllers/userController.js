const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

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
      new Error(
        'This route is not for password updates. Please use /updatePassword.'
      )
    );
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      image: req.file.filename,
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
