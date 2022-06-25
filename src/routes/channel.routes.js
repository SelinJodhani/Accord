const express = require('express');

const messageRoutes = require('./public-message.routes');
const channelController = require('../controllers/channel.controller');
const serverMiddlewares = require('../middlewares/server.middleware');

const { validator } = require('../middlewares/validate.middleware');
const { createChannelSchema } = require('../validations/channel.validation');

const router = express.Router({ mergeParams: true });

router.use('/:channelSlug/messages', messageRoutes);

router.use(serverMiddlewares.checkServerAuthority);

router
  .route('/')
  .post(validator(createChannelSchema), channelController.create);
router.route('/:channelSlug').delete(channelController.delete);

module.exports = router;
