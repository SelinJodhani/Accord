const express = require('express');

const messageRoutes = require('./message.routes');
const channelController = require('../controllers/channel.controller');
const serverMiddlewares = require('../middlewares/server.middlewares');

const router = express.Router({ mergeParams: true });

router.use('/:channelSlug/messages', messageRoutes);

router.use(serverMiddlewares.checkServerAuthority);

router.route('/').post(channelController.create);
router.route('/:channelSlug').delete(channelController.delete);

module.exports = router;
