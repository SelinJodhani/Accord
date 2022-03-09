const express = require('express');
const morgan = require('morgan');

const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.use('/api/users', userRoutes);

app.use((err, req, res, next) => {
  res.status(400).json({
    status: 'fail',
    name: err.name,
    message: err.message,
    stack: err.stack,
  });
});

module.exports = app;
