const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

const server = require('http').Server(app);

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

io.on('connection', socket => {
  socket.emit('connected');

  socket.on('join-channel', channelSlug => {
    socket.join(channelSlug);
  });

  socket.on('message', data => {
    socket.to(data.channelSlug).emit('newMessage', data);
  });
});

server.listen(process.env.PORT || 8000, () => {
  console.log(`Server is listening to PORT: ${process.env.PORT}`);
});
