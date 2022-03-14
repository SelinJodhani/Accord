const express = require('express');

const authController = require('../controllers/authController');
const serverController = require('../controllers/serverController');

const router = express.Router();

router.route('/all').get(authController.protect, serverController.all);

router
  .route('/')
  .get(authController.protect, serverController.find)
  .post(
    authController.protect,
    serverController.uploadServerImage,
    serverController.create
  );

router
  .route('/:slug')
  .get(authController.protect, serverController.get)
  .patch(
    authController.protect,
    serverController.uploadServerImage,
    serverController.update
  )
  .delete(authController.protect, serverController.delete);

router.route('/:slug/join').get(authController.protect, serverController.join);
router
  .route('/:slug/leave')
  .get(authController.protect, serverController.leave);

module.exports = router;
