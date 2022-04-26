const express = require('express');

const publicMessageController = require('../controllers/public-message.controller');

const router = express.Router({ mergeParams: true });

router.route('/').get(publicMessageController.all);

module.exports = router;
