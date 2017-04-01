const router = require('express').Router()

module.exports = (controllers, middlewares) => {
  const pictureController = controllers.pictureController
  const pictureMiddleware = middlewares.pictureMiddleware
  const authMiddleware = middlewares.authMiddleware

  router
    .post('/api/pictures/upload', pictureMiddleware.uploadSingle('pictureFile'), pictureController.uploadPicture)
    .get('/api/pictures/:size/:pictureId', pictureController.getPictureById)
    .get('/api/pictures/:username', pictureController.getPicturesByUsername)
    .post('/api/pictures/comment/:pictureId', authMiddleware.isAuthenticated(), pictureController.commentPictureById)
    .post('/api/pictures/like/:pictureId', authMiddleware.isAuthenticated(), pictureController.likePictureById)
    .post('/api/pictures/unlike/:pictureId', authMiddleware.isAuthenticated(), pictureController.unLikePictureById)

  return router
}
