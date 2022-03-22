const express = require('express');

const uploadImage = require('../middlewares/uploadImageMiddlewares')('User');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const authMiddlewares = require('../middlewares/authMiddlewares');

const router = express.Router();

router.route('/login').post(authController.login);
router.route('/signup').post(authController.signup);

router.route('/forgotPassword').post(authController.forgotPassword);
router.route('/resetPassword/:token').post(authController.resetPassword);

router.use(authMiddlewares.protect);

router.patch('/updatePassword', authController.updatePassword);

router.route('/').get(userController.find);
router.patch('/updateMe', uploadImage, userController.update);

module.exports = router;
