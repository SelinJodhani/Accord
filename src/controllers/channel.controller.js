const createError = require('http-errors');

const Channel = require('../models/Channel');
const Server = require('../models/Server');
const catchAsync = require('../utils/catch.async');
const { deleteChannel } = require('../utils/delete.cascade');

exports.create = catchAsync(async (req, res, next) => {
  const server = await Server.findOne({ slug: req.params.serverSlug });

  if (!server) return next(new createError(400, 'Server does not exist!'));

  const channel = await Channel.create({
    name: req.body.name,
    type: req.body.type,
    server: server._id,
  });

  await Server.updateOne(
    { _id: server._id },
    { $push: { channels: channel._id } }
  );

  return res.status(201).json({
    status: 'success',
    data: {
      channel,
    },
  });
});

exports.delete = catchAsync(async (req, res, next) => {
  const channel = await Channel.findOne({
    slug: req.params.channelSlug,
  });

  await deleteChannel(channel._id);

  return res.status(204).json({
    status: 'success',
    data: null,
  });
});
