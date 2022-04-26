const express = require('express');

const {
  uploadImage,
  uploadToCloud,
} = require('../middlewares/image.upload.middlewares');
const channelRoutes = require('./channel.routes');
const serverController = require('../controllers/server.controller');

const authMiddlewares = require('../middlewares/auth.middleware');
const serverMiddlewares = require('../middlewares/server.middleware');

const { validator } = require('../middlewares/validate.middleware');
const {
  createServerSchema,
  updateServerSchema,
} = require('../validations/server.validation');

const router = express.Router();

router.use(authMiddlewares.protect);
router.use('/:serverSlug/channels', channelRoutes);

router
  .route('/')
  .post(
    validator(createServerSchema),
    uploadImage,
    uploadToCloud('Server'),
    serverController.create
  );

router
  .route('/:serverSlug')
  .get(serverController.get)
  .patch(
    validator(updateServerSchema),
    serverMiddlewares.checkServerAuthority,
    uploadImage,
    uploadToCloud('Server'),
    serverController.update
  )
  .delete(serverMiddlewares.checkServerAuthority, serverController.delete);

router.route('/:serverSlug/join').get(serverController.join);
router.route('/:serverSlug/leave').get(serverController.leave);

module.exports = router;
