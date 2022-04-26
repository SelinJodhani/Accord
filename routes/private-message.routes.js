const express = require('express');

const privateMessageController = require('../controllers/private-message.controller');

const router = express.Router({ mergeParams: true });

router.route('/:receiver').get(privateMessageController.all);

module.exports = router;
