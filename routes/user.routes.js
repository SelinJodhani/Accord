const express = require('express');

const userController = require('../controllers/user.controller');
const authController = require('../controllers/auth.controller');

const authMiddlewares = require('../middlewares/auth.middleware');
const { validator } = require('../middlewares/validate.middleware');
const {
  uploadImage,
  uploadToCloud,
} = require('../middlewares/image.upload.middlewares');

const {
  loginSchema,
  signupSchema,
  updateUserSchema,
  updatePasswordSchema,
} = require('../validations/user.validation');

const messageRoutes = require('./private-message.routes');

const router = express.Router();

router.route('/login').post(validator(loginSchema), authController.login);
router.route('/signup').post(validator(signupSchema), authController.signup);

router.route('/forgotPassword').post(authController.forgotPassword);
router.route('/resetPassword/:token').post(authController.resetPassword);

router.use(authMiddlewares.protect);

router.use('/me/chat', messageRoutes);

router.patch(
  '/updatePassword',
  validator(updatePasswordSchema),
  authController.updatePassword
);

router.route('/').get(userController.search);
router.route('/me').get(userController.find);
router.route('/:id').get(userController.get);
router.patch(
  '/updateMe',
  validator(updateUserSchema),
  uploadImage,
  uploadToCloud('User'),
  userController.update
);
router.delete('/deleteMe', userController.delete);

module.exports = router;
