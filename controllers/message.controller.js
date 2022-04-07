const mongoose = require('mongoose');

const Channel = require('../models/Channel');
const Message = require('../models/Message');
const Server = require('../models/Server');
const catchAsync = require('../utils/catch.async');

exports.save = async data => {
  await Message.create({
    _id: new mongoose.mongo.ObjectId(data._id),
    message: data.message,
    reply: data.reply?._id,
    user: data.user._id,
    channelId: data.channelId,
    serverId: data.serverId,
    createdAt: data.createdAt,
  });
};

exports.delete = async data => {
  const server = await Server.findById(data.data.serverId);
  const message = await Message.findById(data.data._id);

  if (
    data.user._id === message.user._id.toString() ||
    server.author._id.toString() === data.user._id
  )
    await Message.findByIdAndDelete(data.data._id);
};

exports.all = catchAsync(async (req, res, next) => {
  const channel = await Channel.findOne({
    slug: req.params.channelSlug,
  });

  const messages = await Message.find({ channelId: channel._id }).sort(
    'createdAt'
  );

  res.status(200).json({
    status: 'success',
    data: {
      messages,
    },
  });
});
