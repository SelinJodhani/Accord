const multer = require('multer');

const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/users');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `User-${req.user._id}-${Date.now()}.${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Only image file is allowed!', 400), false);
  }
};

const upload = multer({
  fileFilter: multerFilter,
  storage: multerStorage,
});

exports.uploadUserImage = upload.single('image');

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
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});
