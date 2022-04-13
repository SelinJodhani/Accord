const express = require('express');

const uploadImage = require('../middlewares/image.upload.middleware')('Server');
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
  .post(uploadImage, validator(createServerSchema), serverController.create);

router
  .route('/:serverSlug')
  .get(serverController.get)
  .patch(
    uploadImage,
    validator(updateServerSchema),
    serverMiddlewares.checkServerAuthority,
    serverController.update
  )
  .delete(serverMiddlewares.checkServerAuthority, serverController.delete);

router.route('/:serverSlug/join').get(serverController.join);
router.route('/:serverSlug/leave').get(serverController.leave);

module.exports = router;
