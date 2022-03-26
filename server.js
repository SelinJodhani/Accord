const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');
const messageController = require('./controllers/messageController');

const server = require('http').Server(app);

const connected_users = [];
let channelId, userId;
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
    allowEIO3: true,
  },
  transport: ['websocket'],
});

dotenv.config({ path: './.env' });

const DATABASE_STRING = process.env.MONGO_CONNECTION_STRING.replace(
  '<PASSWORD>',
  process.env.MONGO_CONNECTION_PASSWORD
);

mongoose.connect(DATABASE_STRING, () => {
  console.log('Database connection successfull.');
});

io.on('connect', socket => {
  socket.on('join-channel', data => {
    channelId = data.channelId;
    userId = data.userId;

    socket.join(data.channelId);
    socket.emit('add-user-connected-ui', connected_users);
    socket.broadcast.to(data.channelId).emit('user-connected', data.userId);
  });

  socket.on('message', data => {
    delete data.user.servers;
    delete data.user.createdAt;

    socket.broadcast.to(data.channelId).emit('new-message', data);
    messageController.save(data);
  });

  socket.on('add-user-ui', data => {
    connected_users.push(data);
    socket.broadcast.emit('add-user-connected-ui', connected_users);
  });

  socket.on('remove-user-connected-ui', data => {
    const userId = data.userId;
    const index = connected_users.findIndex(obj => obj.userId === userId);
    connected_users.splice(index, 1);
    socket.broadcast.emit('add-user-connected-ui', connected_users);
  });

  socket.on('disconnect', () => {
    socket.broadcast.to(channelId).emit('user-disconnected', userId);
  });
});

server.listen(process.env.PORT || 8000, () => {
  console.log(`Server is listening to PORT: ${process.env.PORT}`);
});
