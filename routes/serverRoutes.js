const express = require('express');

const channelRoutes = require('../routes/channelRoutes');
const authController = require('../controllers/authController');
const serverController = require('../controllers/serverController');

const router = express.Router();

router.use(authController.protect);
router.use('/:serverSlug/channels', channelRoutes);

router
  .route('/')
  .get(serverController.find)
  .post(serverController.uploadServerImage, serverController.create);

router
  .route('/:serverSlug')
  .get(serverController.get)
  .patch(
    serverController.uploadServerImage,
    serverController.checkServerAuthority,
    serverController.update
  )
  .delete(serverController.checkServerAuthority, serverController.delete);

router.route('/:serverSlug/join').get(serverController.join);
router.route('/:serverSlug/leave').get(serverController.leave);

module.exports = router;
