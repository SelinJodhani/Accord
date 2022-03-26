const fs = require('fs');

const Channel = require('../models/channelModel');
const Message = require('../models/messageModel');
const Server = require('../models/serverModel');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

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
  const channel = await Channel.create({
    name: 'General',
    server: server._id,
  });

  await User.updateOne({ _id: user._id }, { $push: { servers: server._id } });
  await Server.updateOne(
    { _id: server._id },
    { $push: { channels: channel._id } }
  );

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
      new: false,
      runValidators: true,
    }
  );

  if (server.image !== 'Accord.png')
    await fs.promises.unlink(
      `${__dirname}/../public/images/servers/${server.image}`
    );

  res.status(200).json({
    status: 'success',
    data: {
      server,
    },
  });
});

exports.delete = catchAsync(async (req, res, next) => {
  const server = await Server.findOneAndDelete({ slug: req.params.serverSlug });

  await User.updateMany(
    { servers: server._id },
    { $pull: { servers: server._id } }
  );
  await Channel.deleteMany({ server: server._id });
  await Message.deleteMany({ server: server._id });

  if (server.image !== 'Accord.png')
    await fs.promises.unlink(
      `${__dirname}/../public/images/servers/${server.image}`
    );

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
