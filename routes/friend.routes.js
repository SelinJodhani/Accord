const express = require('express');

const friendController = require('../controllers/friend.controller');
const authMiddlewares = require('../middlewares/auth.middleware');

// const { validator } = require('../middlewares/validate.middleware');
// const { createChannelSchema } = require('../validations/channel.validation');

const router = express.Router();

router.use(authMiddlewares.protect);

router.route('/all').get(friendController.all);
router.route('/pending').get(friendController.pending);

router.route('/send').post(friendController.send);
router.route('/cancel').post(friendController.cancel);
router.route('/accept').post(friendController.accept);
router.route('/decline').post(friendController.decline);
router.route('/unfriend').post(friendController.unfriend);

module.exports = router;
