const catchAsync = require('../utils/catch.async');
const createError = require('http-errors');
const { FriendList, FriendRequest } = require('../models/Friend');

exports.unfriend = async (req, res, next) => {
  const removerFriendList = await FriendList.findOne({
    user: req.body.remover,
  });
  const removeeFriendList = await FriendList.findOne({
    user: req.body.removee,
  });

  if (
    !(
      removerFriendList.friends.includes(req.body.removee) &&
      removeeFriendList.friends.includes(req.body.remover)
    )
  ) {
    return next(
      new createError(
        400,
        "You cannnot unfriend a person you're not friend with!"
      )
    );
  }

  removerFriendList.removeFriend(req.body.removee);
  removeeFriendList.removeFriend(req.body.remover);

  res.status(200).json({
    status: 'success',
  });
};

exports.send = catchAsync(async (req, res, next) => {
  const friendRequest = await FriendRequest.findOne({
    $and: [{ sender: req.body.sender }, { receiver: req.body.receiver }],
  });

  if (!friendRequest) {
    await FriendRequest.create({
      sender: req.body.sender,
      receiver: req.body.receiver,
    });

    return res.status(201).json({
      status: 'success',
    });
  }

  if (!friendRequest.isActive) {
    friendRequest.isActive = true;
    await friendRequest.save();

    return res.status(201).json({
      status: 'success',
    });
  }

  return next(new createError(400, 'Friend Request already exist!'));
});

exports.accept = catchAsync(async (req, res, next) => {
  const friendRequest = await FriendRequest.findOne({
    $and: [{ sender: req.body.sender }, { receiver: req.body.receiver }],
  });

  if (!(friendRequest && friendRequest.isActive))
    return next(new createError(400, "Friend Request doesn't exist!"));

  const senderFriendList = await FriendList.findOne({
    user: req.body.sender,
  });
  const receiverFriendList = await FriendList.findOne({
    user: req.body.receiver,
  });

  if (senderFriendList && receiverFriendList) {
    senderFriendList.addFriend(friendRequest.receiver);
    receiverFriendList.addFriend(friendRequest.sender);
  }

  friendRequest.isActive = false;
  await friendRequest.save();

  return res.status(200).json({
    status: 'success',
  });
});

exports.decline = catchAsync(async (req, res, next) => {
  const friendRequest = await FriendRequest.findOne({
    $and: [{ sender: req.body.sender }, { receiver: req.body.receiver }],
  });

  if (!(friendRequest && friendRequest.isActive))
    return next(new createError(400, "Friend Request doesn't exist!"));

  friendRequest.isActive = false;
  await friendRequest.save();

  return res.status(200).json({
    status: 'success',
  });
});
