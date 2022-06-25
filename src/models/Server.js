const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);

const serverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Server Name is required!'],
    },
    slug: {
      type: String,
      slug: 'name',
      unique: true,
      lowercase: false,
    },
    image: {
      type: String,
      default:
        'https://res.cloudinary.com/du0p5yed7/image/upload/v1650957028/Accord/images/servers/Accord_xwlbjb.png',
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
    path: 'author',
    select: '-__v -servers',
  })
    .populate({
      path: 'channels',
      select: ' -__v -server',
    })
    .populate({
      path: 'users',
      select: '-__v -servers',
    });
  next();
});

const Server = mongoose.model('Server', serverSchema);

module.exports = Server;
