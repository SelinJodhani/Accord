const messageController = require('./controllers/message.controller');

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
      delete data.user.servers;
      delete data.user.createdAt;

      console.log(data);

      io.in(data.channelId).emit('new-message', data);
      messageController.save(data);
    });

    socket.on('delete-message', data => {
      io.in(data.data.channelId).emit('delete-message', data);
      messageController.delete(data);
    });

    socket.on('leave-text-channel', () => {
      socket.rooms.forEach(room => socket.leave(room));
    });

    socket.on('file-meta', function (data) {
      console.log(data);
      io.in(data.channelId).emit('fs-meta', data);
    });
    socket.on('fs-start', function (data) {
      console.log(data);
      io.in(data.channelId).emit('fs-share', {});
    });
    socket.on('file-raw', function (data) {
      console.log(data);
      io.in(data.channelId).emit('fs-share', data.buffer);
    });

    socket.on('send-files', data => {
      io.in(data.channelId).emit('send-files', data);
    });

    socket.on('disconnected', data => {
      removeUser(data);

      io.in(data.channelId).emit(
        'update-ui',
        connected_users[data.channelId]?.users
      );
      socket.disconnect();
    });
  });
};
