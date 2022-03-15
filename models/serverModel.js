const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);

const serverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Server name is required!'],
  },
  slug: {
    type: String,
    slug: 'name',
    unique: true,
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

serverSchema.pre('save', function (next) {
  if (!this.isNew) return next();

  this.users.push(this.author._id);
  next();
});

serverSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'author',
    select: '-servers -createdAt -__v',
  })
    .populate({
      path: 'users',
      select: '-servers -createdAt -__v',
    })
    .populate({
      path: 'channels',
      select: '-server -createdAt -__v ',
    })
    .select('-__v');
  next();
});

const Server = mongoose.model('Server', serverSchema);

module.exports = Server;
