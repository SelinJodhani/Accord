const express = require('express');

const messageController = require('../controllers/messageController');

const router = express.Router({ mergeParams: true });

router.route('/').get(messageController.all);

module.exports = router;
