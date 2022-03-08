const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './.env' });

const DATABASE_STRING = process.env.MONGO_CONNECTION_STRING.replace(
    '<PASSWORD>',
    process.env.MONGO_CONNECTION_PASSWORD
);

mongoose.connect(DATABASE_STRING, () => {
    console.log('Database connection successfull.');
});

app.listen(process.env.PORT || 8000, () => {
    console.log(`Server is listening to PORT: ${process.env.PORT}`);
});
