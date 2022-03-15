const Channel = require('../models/channelModel');
const Server = require('../models/serverModel');
const catchAsync = require('../utils/catchAsync');

exports.create = catchAsync(async (req, res, next) => {
  const server = await Server.findOne({ slug: req.params.serverSlug });
  const channel = await Channel.create({
    name: req.body.name,
    server: server._id,
  });

  await Server.updateOne(
    { _id: server._id },
    { $push: { channels: channel._id } }
  );

  res.status(201).json({
    status: 'success',
    data: {
      channel,
    },
  });
});

exports.delete = catchAsync(async (req, res, next) => {
  const channel = await Channel.findOneAndDelete({
    slug: req.params.channelSlug,
  });

  await Server.updateOne(
    { slug: req.params.serverSlug },
    { $pull: { channels: channel._id } }
  );

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
