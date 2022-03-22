const express = require('express');

const uploadImage = require('../middlewares/uploadImageMiddlewares')('Server');
const channelRoutes = require('../routes/channelRoutes');
const serverController = require('../controllers/serverController');

const authMiddlewares = require('../middlewares/authMiddlewares');
const serverMiddlewares = require('../middlewares/serverMiddlewares');

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
