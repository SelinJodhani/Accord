const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.ObjectId,
    },
    message: {
      type: String,
      trim: true,
      required: [true, 'Message cannot be empty!'],
    },
    reply: {
      type: mongoose.Schema.ObjectId,
      ref: 'Message',
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

messageSchema.index({ channel: 1 });
messageSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

messageSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: '-__v -createdAt -servers -email',
  }).populate({
    path: 'reply',
    select: '-__v -reply',
  });
  next();
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
