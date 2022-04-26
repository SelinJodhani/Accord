const mongoose = require('mongoose');

const publicMessageSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.ObjectId,
    },
    message: {
      type: String,
      trim: true,
      required: [true, 'PublicMessage cannot be empty!'],
    },
    reply: {
      type: mongoose.Schema.ObjectId,
      ref: 'PublicMessage',
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    channelId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Channel',
    },
    serverId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Server',
    },
  },
  {
    timestamps: true,
  }
);

const privateMessageSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.ObjectId,
    },
    message: {
      type: String,
      trim: true,
      required: [true, 'PublicMessage cannot be empty!'],
    },
    reply: {
      type: mongoose.Schema.ObjectId,
      ref: 'PrivateMessage',
    },
    user1: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    user2: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

publicMessageSchema.index({ channel: 1 });
publicMessageSchema.index({ createdAt: 1 }, { expireAfterSeconds: 172800 });
publicMessageSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: '-__v -servers -email',
  }).populate({
    path: 'reply',
    select: '-__v -reply',
  });
  next();
});

privateMessageSchema.index({ createdAt: 1 }, { expireAfterSeconds: 172800 });
privateMessageSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user1',
    select: '-__v -servers -email',
  })
    .populate({
      path: 'user2',
      select: '-__v -servers -email',
    })
    .populate({
      path: 'reply',
      select: '-__v -reply',
    });
  next();
});

module.exports = {
  PublicMessage: mongoose.model('PublicMessage', publicMessageSchema),
  PrivateMessage: mongoose.model('PrivateMessage', privateMessageSchema),
};
