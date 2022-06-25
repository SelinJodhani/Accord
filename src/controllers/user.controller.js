const createError = require('http-errors');

const User = require('../models/User');
const { FriendList, FriendRequest } = require('../models/Friend');

const catchAsync = require('../utils/catch.async');
const { deleteUser } = require('../utils/delete.cascade');
const { areFriends } = require('./friend.controller');

exports.get = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-servers');

  if (!user) return next(new createError(400, 'User doesn not exist!'));

  return res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.find = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id)
    .populate({
      path: 'servers',
      select: '-__v -users -createdAt',
    })
    .select('-__v');

  return res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.search = catchAsync(async (req, res, next) => {
  let updatedUsers = [];
  const { search } = req.query;

  const users = await User.find({ name: { $regex: search, $options: 'i' } });
  const loggedinUserFriendList = await FriendList.findOne({
    user: req.user._id,
  });

  for (let user of users) {
    const otherUserFriendList = await FriendList.findOne({ user: user._id });

    if (areFriends(loggedinUserFriendList, otherUserFriendList)) {
      updatedUsers.push({ ...user, friend_request_status: 'friends' });
      continue;
    }

    const friendRequest = await FriendRequest.findOne({
      $and: [
        { sender: req.user._id },
        { receiver: user._id },
        { isActive: true },
      ],
    });

    friendRequest
      ? updatedUsers.push({ ...user, friend_request_status: 'pending' })
      : updatedUsers.push({ ...user, friend_request_status: 'not_sent' });
  }

  return res.status(200).json({
    status: 'success',
    data: {
      users: updatedUsers,
    },
  });
});

exports.update = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new createError(
        400,
        'This route is not for password updates. Please use /updatePassword.'
      )
    );
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      image: req.image ? req.image : undefined,
    },
    {
      new: false,
      runValidators: true,
    }
  );

  return res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.delete = catchAsync(async (req, res, next) => {
  await deleteUser(req.user._id);

  return res.status(204).json({
    status: 'success',
    data: null,
  });
});
