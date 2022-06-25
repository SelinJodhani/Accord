require('mongoose').connect(process.env.MONGO_CONNECTION_STRING);

require('cloudinary').v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: false,
});

const app = require('./app');
const init = require('./socket');

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

init(io);

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server is listening to PORT: ${PORT}`);
});
