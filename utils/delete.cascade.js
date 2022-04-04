const User = require('../models/User');
const Server = require('../models/Server');
const Channel = require('../models/Channel');
const Message = require('../models/Message');

exports.deleteUser = async user_id => {
  await Server.updateMany({ users: user_id }, { $pull: { users: user_id } });
  await Server.deleteMany({ author: user_id });
  await Channel.deleteMany({ server: server_id });
  await Message.deleteMany({ user: user_id });
};

exports.deleteServer = async server_id => {
  await User.updateMany(
    { servers: server_id },
    { $pull: { servers: server_id } }
  );
  await Channel.deleteMany({ server: server_id });
  await Message.deleteMany({ server: server_id });
};

exports.deleteChannel = async (channel_id, server_slug) => {
  await Message.deleteMany({ channel: channel_id });
  await Server.updateOne(
    { slug: server_slug },
    { $pull: { channels: channel_id } }
  );
};
