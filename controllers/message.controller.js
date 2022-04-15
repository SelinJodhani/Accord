const mongoose = require('mongoose');

const Channel = require('../models/Channel');
const { PublicMessage } = require('../models/Message');
const Server = require('../models/Server');
const catchAsync = require('../utils/catch.async');

exports.save = async data => {
  await PublicMessage.create({
    _id: new mongoose.mongo.ObjectId(data._id),
    message: data.message,
    reply: data.reply?._id,
    type: data.type,
    user: data.user._id,
    channelId: data.channelId,
    serverId: data.serverId,
    createdAt: data.createdAt,
  });
};

exports.delete = async data => {
  const server = await Server.findById(data.data.serverId);
  const message = await PublicMessage.findById(data.data._id);

  if (
    data.user._id === message.user._id.toString() ||
    server.author._id.toString() === data.user._id
  )
    await PublicMessage.findByIdAndDelete(data.data._id);
};

exports.all = catchAsync(async (req, res, next) => {
  const channel = await Channel.findOne({
    slug: req.params.channelSlug,
  });

  const messages = await PublicMessage.find({ channelId: channel._id }).sort(
    'createdAt'
  );

  return res.status(200).json({
    status: 'success',
    data: {
      messages,
    },
  });
});
