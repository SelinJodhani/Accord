const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const compression = require('compression');

const userRoutes = require('./routes/user.routes');
const serverRoutes = require('./routes/server.routes');

const createError = require('http-errors');
const globalErrorHandler = require('./controllers/utils/error.controller');

const app = express();
const router = express.Router();

app.use(cors());
app.use(morgan('dev'));
app.use(compression());

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use('/api', router);

router.use('/users', userRoutes);
router.use('/servers', serverRoutes);

router.all('*', (req, res, next) => {
  next(new createError(404, `Can't find ${req.originalUrl} on this server!`));
});

app.use(globalErrorHandler);

module.exports = app;
