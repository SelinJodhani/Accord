const express = require('express');
const morgan = require('morgan');

const userRoutes = require('./routes/userRoutes');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/utils/errorController');

const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.use('/api/users', userRoutes);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
