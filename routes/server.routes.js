const express = require('express');

const uploadImage = require('../middlewares/image.upload.middlewares')(
  'Server'
);
const channelRoutes = require('./channel.routes');
const serverController = require('../controllers/server.controller');

const authMiddlewares = require('../middlewares/auth.middlewares');
const serverMiddlewares = require('../middlewares/server.middlewares');

const router = express.Router();

router.use(authMiddlewares.protect);
router.use('/:serverSlug/channels', channelRoutes);

router
  .route('/')
  .get(serverController.find)
  .post(uploadImage, serverController.create);

router
  .route('/:serverSlug')
  .get(serverController.get)
  .patch(
    uploadImage,
    serverMiddlewares.checkServerAuthority,
    serverController.update
  )
  .delete(serverMiddlewares.checkServerAuthority, serverController.delete);

router.route('/:serverSlug/join').get(serverController.join);
router.route('/:serverSlug/leave').get(serverController.leave);

module.exports = router;
