const express = require('express');

const serverController = require('../controllers/serverController');
const channelController = require('../controllers/channelController');

const router = express.Router({ mergeParams: true });

router.use(serverController.checkServerAuthority);

router.route('/').post(channelController.create);
router.route('/:channelSlug').delete(channelController.delete);

module.exports = router;
