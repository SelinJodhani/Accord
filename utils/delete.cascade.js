const User = require('../models/User');
const Server = require('../models/Server');
const Channel = require('../models/Channel');
const Message = require('../models/Message');

exports.deleteUser = async user_id => {
  const user = User.findByIdAndDelete(user_id);
  const servers = await Server.find({ author: user._id });

  servers.forEach(server => {
    this.deleteServer(server._id);
  });
  await Server.updateMany({ users: user._id }, { $pull: { users: user._id } });
};

exports.deleteServer = async server_id => {
  const server = await Server.findByIdAndDelete(server_id);
  const channels = await Channel.find({ server: server._id });

  channels.forEach(channel => {
    this.deleteChannel(channel._id);
  });
  await User.updateMany(
    { servers: server._id },
    { $pull: { servers: server._id } }
  );
};

exports.deleteChannel = async channel_id => {
  const channel = await Channel.findByIdAndDelete(channel_id);
  const server = await Server.findById(channel.server);
  const messages = await Message.find({ channelId: channel._id });

  messages.forEach(message => this.deleteMessage(message._id));
  if (server)
    await Server.findByIdAndUpdate(server._id, {
      $pull: { channels: channel._id },
    });
};

exports.deleteMessage = async message_id => {
  await Message.findByIdAndDelete(message_id);
};
