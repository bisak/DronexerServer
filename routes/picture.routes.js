const router = require('express').Router()

module.exports = (controllers, middlewares) => {
  const pictureController = controllers.pictureController
  const pictureMiddleware = middlewares.pictureMiddleware
  const authMiddleware = middlewares.authMiddleware

  return router
    .post('/upload', pictureMiddleware.uploadSingle('pictureFile'), authMiddleware.isAuthenticated(), pictureController.uploadPicture)
    .get('/:year/:month/:day/:size/:fileName', pictureController.getSinglePicture)
}
