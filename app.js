const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const serverRoutes = require('./routes/serverRoutes');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/utils/errorController');

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use('/api/users', userRoutes);
app.use('/api/servers', serverRoutes);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
