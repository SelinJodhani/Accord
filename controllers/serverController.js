const Server = require('../models/serverModel');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const serverController = {
  all: catchAsync(async (req, res, next) => {
    const servers = await Server.find();

    res.status(200).json({
      status: 'success',
      data: {
        servers,
      },
    });
  }),

  find: catchAsync(async (req, res, next) => {
    const server = await Server.find({ slug: req.params.slug })
      .populate({ path: 'author', select: '-servers -createdAt -__v' })
      .populate({ path: 'users', select: '-servers -createdAt -__v' })
      .select('-__v');

    if (!server) return next(new AppError('Server does not exist!'));

    res.status(200).json({
      status: 'success',
      data: {
        server,
      },
    });
  }),

  create: catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user._id);
    const server = await Server.create({
      name: req.body.name,
      author: req.user._id,
    });

    user.servers.push(server._id);
    user.save({ validateBeforeSave: false });

    res.status(201).json({
      status: 'success',
      data: {
        server,
      },
    });
  }),

  join: catchAsync(async (req, res, next) => {
    const server = await Server.findOne({ slug: req.params.slug });
    const user = await User.findById(req.user._id);

    if (!server) return next(new AppError('Server does not exist!'));

    if (server.users.find(id => id.equals(user._id)))
      return next(new AppError('User alredy exist in this server!', 400));

    server.users.push(user._id);
    user.servers.push(server._id);

    user.save({ validateBeforeSave: false });
    server.save({ validateBeforeSave: false });

    res.status(200).json({
      status: 'success',
      message: 'Server joined successfully',
    });
  }),

  leave: catchAsync(async (req, res, next) => {
    const server = await Server.findOne({ slug: req.params.slug });
    const user = await User.findById(req.user._id);

    if (!server) return next(new AppError('Server does not exist!'));

    if (!server.users.find(id => id.equals(user._id)))
      return next(
        new AppError(
          'Why are you trying to leave a server in which you are not exist!',
          400
        )
      );

    server.users.splice(server.users.indexOf(user._id), 1);
    user.servers.splice(user.servers.indexOf(server._id), 1);

    user.save({ validateBeforeSave: false });
    server.save({ validateBeforeSave: false });

    res.status(200).json({
      status: 'success',
      message: 'Server left successfully',
    });
  }),
};

module.exports = serverController;
