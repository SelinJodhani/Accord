const mongoose = require('mongoose');

const Channel = require('../models/Channel');
const Message = require('../models/Message');
const catchAsync = require('../utils/catch.async');

exports.save = async data => {
  await Message.create({
    _id: new mongoose.mongo.ObjectId(data._id),
    message: data.message,
    reply: data.reply?._id,
    user: data.user._id,
    channel: data.channelId,
    server: data.serverId,
    createdAt: data.createdAt,
  });
};

exports.all = catchAsync(async (req, res, next) => {
  const channel = await Channel.findOne({
    slug: req.params.channelSlug,
  });

  const messages = await Message.find({ channel: channel._id }).sort(
    'createdAt'
  );

  res.status(200).json({
    status: 'success',
    data: {
      messages,
    },
  });
});
