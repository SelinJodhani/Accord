const express = require('express');

const authController = require('../controllers/authController');
const serverController = require('../controllers/serverController');

const router = express.Router();

router.route('/').post(authController.protect, serverController.create);

router.route('/:slug').get(authController.protect, serverController.find);
router.route('/:slug/join').get(authController.protect, serverController.join);
router
  .route('/:slug/leave')
  .get(authController.protect, serverController.leave);

router.route('/all').get(authController.protect, serverController.all);

module.exports = router;
