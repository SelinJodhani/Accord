const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);

const channelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Channel name is required!'],
  },
  slug: {
    type: String,
    slug: 'name',
    unique: true,
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

const Channel = mongoose.model('Channel', channelSchema);

module.exports = Channel;
