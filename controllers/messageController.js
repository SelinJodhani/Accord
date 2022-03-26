const Channel = require('../models/channelModel');
const Message = require('../models/messageModel');
const Server = require('../models/serverModel');
const catchAsync = require('../utils/catchAsync');

exports.save = async data => {
  await Message.create({
    message: data.message,
    user: data.user._id,
    channel: data.channelId,
    server: data.serverId,
    createdAt: data.createdAt,
  });
};

exports.all = catchAsync(async (req, res, next) => {
  const channel = await Channel.findOne({ slug: req.params.channelSlug });
  const [year, month, date] = new Date().toISOString().split('T')[0].split('-');

  const messages = await Message.find({
    $and: [
      { channel: channel._id },
      {
        createdAt: {
          $gte: new Date(year, month - 1, date),
          $lt: new Date(year, month - 1, date + 1),
        },
      },
    ],
  }).sort('createdAt');

  res.status(200).json({
    status: 'success',
    data: {
      messages,
    },
  });
});
