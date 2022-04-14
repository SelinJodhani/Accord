const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);

const serverSchema = new mongoose.Schema(
  {
    name: String,
    slug: {
      type: String,
      slug: 'name',
      unique: true,
      lowercase: false,
    },
    image: {
      type: String,
      default: 'Accord.png',
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    users: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
    channels: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Channel',
      },
    ],
  },
  { timestamps: true }
);

serverSchema.pre('save', function (next) {
  if (!this.isNew) return next();

  this.users.push(this.author._id);
  next();
});

serverSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'channels',
    select: ' -__v -server',
  });
  next();
});

const Server = mongoose.model('Server', serverSchema);

module.exports = Server;
