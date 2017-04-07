const router = require('express').Router()

module.exports = (controllers, middlewares) => {
  const pictureController = controllers.pictureController
  const pictureMiddleware = middlewares.pictureMiddleware
  const authMiddleware = middlewares.authMiddleware

  router
    .post('/upload', pictureMiddleware.uploadSingle('pictureFile'), pictureController.uploadPicture)
    .post('/comment/:pictureId', authMiddleware.isAuthenticated(), pictureController.commentPictureById)
    .post('/like/:pictureId', authMiddleware.isAuthenticated(), pictureController.likePictureById)
    .post('/unlike/:pictureId', authMiddleware.isAuthenticated(), pictureController.unLikePictureById)
    .get('/:username', authMiddleware.extractUserFromToken(), pictureController.getPicturesByUsername)
    .get('/comments/:pictureId', pictureController.getCommentsByPictureId)
    .get('/:size/:pictureId', pictureController.getPictureById)
    .get('/explore', pictureController.getExplorePictures)


  return router
}
