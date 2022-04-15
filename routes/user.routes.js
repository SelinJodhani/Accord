const express = require('express');

const uploadImage = require('../middlewares/image.upload.middleware')('User');
const userController = require('../controllers/user.controller');
const authController = require('../controllers/auth.controller');

const authMiddlewares = require('../middlewares/auth.middleware');

const { validator } = require('../middlewares/validate.middleware');
const {
  loginSchema,
  signupSchema,
  updateUserSchema,
  updatePasswordSchema,
} = require('../validations/user.validation');

const router = express.Router();

router.route('/login').post(validator(loginSchema), authController.login);
router.route('/signup').post(validator(signupSchema), authController.signup);

router.route('/forgotPassword').post(authController.forgotPassword);
router.route('/resetPassword/:token').post(authController.resetPassword);

router.use(authMiddlewares.protect);

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
  uploadImage,
  validator(updateUserSchema),
  userController.update
);
router.delete('/deleteMe', userController.delete);

module.exports = router;
