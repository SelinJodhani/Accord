const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Message = require('./models/messageModel');

dotenv.config();

const DATABASE_STRING = process.env.MONGO_CONNECTION_STRING.replace(
  '<PASSWORD>',
  process.env.MONGO_CONNECTION_PASSWORD
);

mongoose.connect(DATABASE_STRING, () => {
  console.log('Database connection successfull.');
});

async function deleteMessages() {
  await Message.deleteMany();
}

deleteMessages();
console.log('deleted');
