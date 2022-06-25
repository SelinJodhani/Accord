const createError = require('http-errors');

const catchAsync = require('../utils/catch.async');
const { FriendList, FriendRequest } = require('../models/Friend');

exports.areFriends = (person1FriendList, person2FriendList) => {
  return (
    person1FriendList.friends.includes(person2FriendList.user.toString()) &&
    person2FriendList.friends.includes(person1FriendList.user.toString())
  );
};

exports.all = catchAsync(async (req, res, next) => {
  const friendList = await FriendList.findOne({ user: req.user._id }).populate({
    path: 'friends',
    select: '-__v -servers',
  });

  return res.status(200).json({
    status: 'success',
    data: {
      friends: friendList.friends,
    },
  });
});

exports.pending = catchAsync(async (req, res, next) => {
  const friendRequests = await FriendRequest.find({
    $and: [{ receiver: req.user._id }, { isActive: true }],
  }).populate({
    path: 'sender',
    select: '-__v -servers',
  });

  return res.status(200).json({
    status: 'success',
    data: {
      friendRequests,
    },
  });
});

exports.unfriend = catchAsync(async (req, res, next) => {
  const remover = req.user._id.toString();
  const removee = req.body.removee.toString();

  const removerFriendList = await FriendList.findOne({
    user: remover,
  });
  const removeeFriendList = await FriendList.findOne({
    user: removee,
  });

  if (remover === removee)
    return next(createError(400, 'How can you unfriend yourself?'));

  if (!this.areFriends(removerFriendList, removeeFriendList)) {
    return next(
      new createError(
        400,
        "You cannnot unfriend a person you're not friend with!"
      )
    );
  }

  removerFriendList.removeFriend(removee);
  removeeFriendList.removeFriend(remover);

  return res.status(200).json({
    status: 'success',
    message: `Successfully unfriended that person.`,
  });
});

exports.send = catchAsync(async (req, res, next) => {
  const sender = req.user._id.toString();
  const receiver = req.body.receiver.toString();

  const senderFriendList = await FriendList.findOne({
    user: sender,
  });
  const receiverFriendList = await FriendList.findOne({
    user: receiver,
  });

  if (sender === receiver)
    return next(
      createError(400, 'You cannot send friend request to yourself!')
    );

  if (this.areFriends(senderFriendList, receiverFriendList)) {
    return next(
      new createError(
        400,
        "You cannnot send friend request to person you're already friend with!"
      )
    );
  }

  const friendRequest = await FriendRequest.findOne({
    $and: [{ sender: sender }, { receiver: receiver }],
  });

  if (!friendRequest) {
    await FriendRequest.create({
      sender: sender,
      receiver: receiver,
    });

    return res.status(201).json({
      status: 'success',
      message: 'Friend request sent successfully',
    });
  }

  if (!friendRequest.isActive) {
    friendRequest.isActive = true;
    await friendRequest.save();

    return res.status(201).json({
      status: 'success',
    });
  }

  return next(
    new createError(400, "You've already sent friend request to this person!")
  );
});

exports.accept = catchAsync(async (req, res, next) => {
  const sender = req.body.sender.toString();
  const receiver = req.user._id.toString();

  const friendRequest = await FriendRequest.findOne({
    $and: [{ sender: sender }, { receiver: receiver }],
  });

  if (!(friendRequest && friendRequest.isActive))
    return next(new createError(400, "Friend Request doesn't exist!"));

  const senderFriendList = await FriendList.findOne({
    user: sender,
  });
  const receiverFriendList = await FriendList.findOne({
    user: receiver,
  });

  if (senderFriendList && receiverFriendList) {
    senderFriendList.addFriend(friendRequest.receiver);
    receiverFriendList.addFriend(friendRequest.sender);
  }

  friendRequest.isActive = false;
  await friendRequest.save();

  return res.status(200).json({
    status: 'success',
    message: "You're now friends this person",
  });
});

exports.decline = catchAsync(async (req, res, next) => {
  const sender = req.body.sender.toString();
  const receiver = req.user._id.toString();

  const friendRequest = await FriendRequest.findOne({
    $and: [{ sender: sender }, { receiver: receiver }],
  });

  if (!(friendRequest && friendRequest.isActive))
    return next(new createError(400, "Friend Request doesn't exist!"));

  friendRequest.isActive = false;
  await friendRequest.save();

  return res.status(200).json({
    status: 'success',
    message: 'Friend request declined successfully',
  });
});

exports.cancel = catchAsync(async (req, res, next) => {
  const sender = req.user._id.toString();
  const receiver = req.body.receiver.toString();

  const friendRequest = await FriendRequest.findOne({
    $and: [{ sender: sender }, { receiver: receiver }],
  });

  if (!(friendRequest && friendRequest.isActive))
    return next(new createError(400, "Friend Request doesn't exist!"));

  friendRequest.isActive = false;
  await friendRequest.save();

  return res.status(200).json({
    status: 'success',
    message: 'Friend request cancelled successfully',
  });
});
