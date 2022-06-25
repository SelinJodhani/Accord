const createError = require('http-errors');

const Channel = require('../models/Channel');
const Server = require('../models/Server');
const User = require('../models/User');
const catchAsync = require('../utils/catch.async');
const { deleteServer } = require('../utils/delete.cascade');

exports.get = catchAsync(async (req, res, next) => {
  const server = await Server.find({ slug: req.params.serverSlug });

  if (!server) return next(new createError('Server does not exist!'));

  return res.status(200).json({
    status: 'success',
    data: {
      server,
    },
  });
});

exports.create = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const server = await Server.create({
    name: req.body.name,
    image: req.image ? req.image : undefined,
    author: req.user._id,
  });
  const channel = await Channel.create([
    {
      name: 'general',
      type: 'Text',
      server: server._id,
    },
    {
      name: 'General',
      type: 'Voice',
      server: server._id,
    },
  ]);

  const data = channel.map(obj => obj._id);

  await User.updateOne({ _id: user._id }, { $push: { servers: server._id } });
  await Server.updateOne(
    { _id: server._id },
    { $push: { channels: { $each: data } } }
  );

  return res.status(201).json({
    status: 'success',
    data: {
      server,
    },
  });
});

exports.update = catchAsync(async (req, res, next) => {
  const server = await Server.findOneAndUpdate(
    { slug: req.params.serverSlug },
    { name: req.body.name, image: req.image ? req.image : undefined },
    {
      new: false,
      runValidators: true,
    }
  );

  return res.status(200).json({
    status: 'success',
    data: {
      server,
    },
  });
});

exports.delete = catchAsync(async (req, res, next) => {
  const server = await Server.findOne({ slug: req.params.serverSlug });

  await deleteServer(server._id);

  return res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.join = catchAsync(async (req, res, next) => {
  const server = await Server.findOne({ slug: req.params.serverSlug });
  const user = await User.findById(req.user._id);

  if (!server) return next(new createError(404, 'Server does not exist!'));

  if (server.users.find(id => id.equals(user._id)))
    return next(new createError(400, 'User alredy exist in this server!'));

  await Server.updateOne({ _id: server._id }, { $push: { users: user._id } });
  await User.updateOne({ _id: user._id }, { $push: { servers: server._id } });

  return res.status(200).json({
    status: 'success',
    message: 'Server joined successfully',
  });
});

exports.leave = catchAsync(async (req, res, next) => {
  const server = await Server.findOne({ slug: req.params.serverSlug });
  const user = await User.findById(req.user._id);

  if (!server) return next(new createError(400, 'Server does not exist!'));

  if (!server.users.find(id => id.equals(user._id)))
    return next(
      new createError(
        400,
        'Why are you trying to leave a server in which you are not exist!'
      )
    );

  if (server.author._id.equals(user._id))
    return next(new createError(400, 'Author cannot leave their own server!'));

  await Server.updateOne({ _id: server._id }, { $pull: { users: user._id } });
  await User.updateOne({ _id: user._id }, { $pull: { servers: server._id } });

  return res.status(200).json({
    status: 'success',
    message: 'Server left successfully',
  });
});
