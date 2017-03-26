const router = require('express').Router()

module.exports = (controllers, middlewares) => {
  const pictureController = controllers.pictureController
  const pictureMiddleware = middlewares.pictureMiddleware

  router
    .post('/api/pictures/upload', pictureMiddleware.uploadSingle('pictureFile'), pictureController.uploadPicture)
    .get('/api/pictures/:size/:pictureId', pictureController.getPictureById)
    .get('/api/pictures/:username', pictureController.getPicturesByUsername)

  return router
}
