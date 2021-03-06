const publicMessageController = require('./controllers/public-message.controller');
const privateMessageController = require('./controllers/private-message.controller');

const connected_users = {};

const addUser = data => {
  if (!connected_users[data.channelId]) {
    connected_users[data.channelId] = {
      users: [
        {
          _id: data.userId,
          name: data.name,
          image: data.image,
        },
      ],
    };
  } else {
    const userExist = connected_users[data.channelId].users.findIndex(user => {
      return user._id === data.userId;
    });

    if (userExist === -1) {
      connected_users[data.channelId].users.push({
        _id: data.userId,
        name: data.name,
        image: data.image,
      });
    }
  }
};

const removeUser = data => {
  const index = connected_users[data.channelId]?.users.findIndex(
    obj => obj._id === data.userId
  );
  if (index !== -1) connected_users[data.channelId]?.users.splice(index, 1);
};

module.exports = io => {
  io.on('connect', socket => {
    socket.on('join-text-channel', data => {
      socket.join(data.channelId);
      socket.broadcast.to(data.channelId).emit('user-connected', data.userId);
    });

    socket.on('join-voice-channel', data => {
      addUser(data);

      socket.join(data.channelId);
      io.in(data.channelId).emit(
        'update-ui',
        connected_users[data.channelId]?.users
      );
      socket.broadcast.to(data.channelId).emit('user-connected', data.userId);
    });

    socket.on('message', data => {
      delete data?.user?.servers;
      delete data?.user?.createdAt;

      socket.broadcast.to(data.channelId).emit('new-message', data);
      data.isPrivate
        ? privateMessageController.save(data)
        : publicMessageController.save(data);
    });

    socket.on('send-files', data => {
      io.in(data.channelId).emit('send-files', data);
    });

    socket.on('delete-message', data => {
      io.in(data.channelId).emit('delete-message', data);
      data.isPrivate
        ? privateMessageController.delete(data)
        : publicMessageController.delete(data);
    });

    socket.on('leave-text-channel', () => {
      socket.rooms.forEach(room => socket.leave(room));
    });

    socket.on('disconnected', data => {
      removeUser(data);

      socket.broadcast
        .to(data.channelId)
        .emit('update-ui', connected_users[data.channelId]?.users);
      socket.disconnect();
    });
  });
};
