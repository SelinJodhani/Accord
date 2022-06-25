const mongoose = require('mongoose');

const friendListSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    friends: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

const friendRequestSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    receiver: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

friendListSchema.methods.addFriend = async function (user_id) {
  if (!this.friends.includes(user_id)) {
    this.friends.push(user_id);
    this.save();
  }
};

friendListSchema.methods.removeFriend = async function (user_id) {
  if (this.friends.includes(user_id)) {
    const index = this.friends.indexOf(user_id);
    if (index > -1) {
      this.friends.splice(index, 1);
      this.save();
    }
  }
};

module.exports = {
  FriendList: mongoose.model('FriendList', friendListSchema),
  FriendRequest: mongoose.model('FriendRequest', friendRequestSchema),
};
