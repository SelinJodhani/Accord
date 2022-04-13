const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);

const channelSchema = new mongoose.Schema(
  {
    name: String,
    type: {
      type: String,
      enum: ['Text', 'Voice'],
      default: 'Text',
    },
    slug: {
      type: String,
      slug: 'name',
      unique: true,
      lowercase: false,
    },
    server: {
      type: mongoose.Schema.ObjectId,
      ref: 'Server',
    },
  },
  { timestamps: true }
);

channelSchema.pre('save', function () {
  if (this.type === 'Text') this.name = this.name.toLowerCase();
  if (this.type === 'Voice')
    this.name = this.name[0].toUpperCase() + this.name.slice(1);
});

const Channel = mongoose.model('Channel', channelSchema);

module.exports = Channel;
