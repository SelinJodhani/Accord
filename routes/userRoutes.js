const express = require('express');

const uploadImage = require('../utils/uploadImage')('User');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/login').post(authController.login);
router.route('/signup').post(authController.signup);

router.route('/forgotPassword').post(authController.forgotPassword);
router.route('/resetPassword/:token').post(authController.resetPassword);

router.patch(
  '/updatePassword',
  authController.protect,
  authController.updatePassword
);

router.route('/').get(authController.protect, userController.find);
router.patch(
  '/updateMe',
  authController.protect,
  uploadImage,
  userController.update
);

module.exports = router;
