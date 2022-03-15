const multer = require('multer');

const Server = require('../models/serverModel');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/servers');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `Server-${req.user._id}-${Date.now()}.${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image'))
    cb(new AppError('Only image file is allowed!', 400), false);
  cb(null, true);
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadServerImage = upload.single('image');

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

exports.get = catchAsync(async (req, res, next) => {
  const server = await Server.find({ slug: req.params.serverSlug });

  if (!server) return next(new AppError('Server does not exist!'));

  res.status(200).json({
    status: 'success',
    data: {
      server,
    },
  });
});

exports.find = catchAsync(async (req, res, next) => {
  const servers = await Server.find({ users: req.user._id });

  res.status(200).json({
    status: 'success',
    data: {
      servers,
    },
  });
});

exports.create = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const server = await Server.create({
    name: req.body.name,
    image: req.file?.filename,
    author: req.user._id,
  });

  await User.updateOne({ _id: user._id }, { $push: { servers: server._id } });

  res.status(201).json({
    status: 'success',
    data: {
      server,
    },
  });
});

exports.update = catchAsync(async (req, res, next) => {
  const server = await Server.findOneAndUpdate(
    { slug: req.params.serverSlug },
    { name: req.body.name, image: req.file?.filename },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      server,
    },
  });
});

exports.delete = catchAsync(async (req, res, next) => {
  await Server.findOneAndDelete({ slug: req.params.serverSlug });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.join = catchAsync(async (req, res, next) => {
  const server = await Server.findOne({ slug: req.params.serverSlug });
  const user = await User.findById(req.user._id);

  if (!server) return next(new AppError('Server does not exist!'));

  if (server.users.find(id => id.equals(user._id)))
    return next(new AppError('User alredy exist in this server!', 400));

  await Server.updateOne({ _id: server._id }, { $push: { users: user._id } });
  await User.updateOne({ _id: user._id }, { $push: { servers: server._id } });

  res.status(200).json({
    status: 'success',
    message: 'Server joined successfully',
  });
});

exports.leave = catchAsync(async (req, res, next) => {
  const server = await Server.findOne({ slug: req.params.serverSlug });
  const user = await User.findById(req.user._id);

  if (!server) return next(new AppError('Server does not exist!'));

  if (!server.users.find(id => id.equals(user._id)))
    return next(
      new AppError(
        'Why are you trying to leave a server in which you are not exist!',
        400
      )
    );

  await Server.updateOne({ _id: server._id }, { $pull: { users: user._id } });
  await User.updateOne({ _id: user._id }, { $pull: { servers: server._id } });

  res.status(200).json({
    status: 'success',
    message: 'Server left successfully',
  });
});
