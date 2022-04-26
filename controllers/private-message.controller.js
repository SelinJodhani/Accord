const mongoose = require('mongoose');

const { FriendList } = require('../models/Friend');
const { PrivateMessage } = require('../models/Message');

const catchAsync = require('../utils/catch.async');
const createError = require('http-errors');
const { areFriends } = require('./friend.controller');

exports.save = async data => {
  await PrivateMessage.create({
    _id: new mongoose.mongo.ObjectId(data._id),
    message: data.message,
    reply: data.reply?._id,
    user1: data.sender,
    user2: data.receiver,
    createdAt: data.createdAt,
  });
};

// exports.delete = async data => {
//   const server = await Server.findById(data.data.serverId);
//   const message = await PublicMessage.findById(data.data._id);

//   if (
//     data.user._id === message.user._id.toString() ||
//     server.author._id.toString() === data.user._id
//   )
//     await PublicMessage.findByIdAndDelete(data.data._id);
// };

exports.all = catchAsync(async (req, res, next) => {
  const user1FriendList = await FriendList.findOne({
    user: req.user._id,
  });
  const user2FriendList = await FriendList.findOne({
    user: req.params.receiver,
  });

  if (!(user1FriendList || user2FriendList))
    return next(createError(400, "User doesn't exist!"));

  if (!areFriends(user1FriendList, user2FriendList))
    return next(createError(400, 'You are not friends with the other person!'));

  const messages = await PrivateMessage.find({
    $and: [{ user1: req.user._id }, { user2: req.params.receiver }],
  }).sort('createdAt');

  return res.status(200).json({
    status: 'success',
    data: {
      messages,
    },
  });
});
