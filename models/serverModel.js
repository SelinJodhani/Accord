const mongoose = require('mongoose');
const slugify = require('slugify');

const serverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Server name is required!'],
  },
  slug: {
    type: String,
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

serverSchema.pre('save', function (next) {
  if (!this.isNew) return next();

  this.slug = slugify(this.name, { lower: true });
  this.users.push(this.author._id);
  next();
});

const Server = mongoose.model('Server', serverSchema);

module.exports = Server;
