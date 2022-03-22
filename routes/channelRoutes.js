const express = require('express');

const messageRoutes = require('../routes/messageRoutes');
const channelController = require('../controllers/channelController');
const serverMiddlewares = require('../middlewares/serverMiddlewares');

const router = express.Router({ mergeParams: true });

router.use('/:channelSlug/messages', messageRoutes);
router.use(serverMiddlewares.checkServerAuthority);

router.route('/').post(channelController.create);
router.route('/:channelSlug').delete(channelController.delete);

module.exports = router;
