const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const compression = require('compression');
const createError = require('http-errors');

const userRoutes = require('./routes/user.routes');
const serverRoutes = require('./routes/server.routes');
const friendRoutes = require('./routes/friend.routes');

const globalErrorHandler = require('./utils/error.util');

const app = express();
const router = express.Router();

app.use(cors());
app.use(morgan('dev'));
app.use(compression());
app.use(express.json());

app.use('/api', router);

router.use('/users', userRoutes);
router.use('/servers', serverRoutes);
router.use('/friends', friendRoutes);

router.all('*', (req, res, next) => {
  next(new createError(404, `Can't find ${req.originalUrl} on this server!`));
});

app.use(globalErrorHandler);

module.exports = app;
