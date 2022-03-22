const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  message: {
    type: String,
    trim: true,
    required: [true, 'Message cannot be empty!'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  channel: {
    type: mongoose.Schema.ObjectId,
    ref: 'Channel',
  },
  server: {
    type: mongoose.Schema.ObjectId,
    ref: 'Server',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

messageSchema.index({ channel: 1 });

messageSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: '-__v -createdAt -servers -email',
  });
  next();
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
