const router = require('express').Router()
const errorCatcher = require('../util').errorCatcher

module.exports = (controllers, middlewares) => {
  const pictureController = controllers.pictureController
  const pictureMiddleware = middlewares.pictureMiddleware
  const authMiddleware = middlewares.authMiddleware

  return router
    .post('/upload', pictureMiddleware.uploadSingle('pictureFile'), authMiddleware.isAuthenticated(), errorCatcher(pictureController.uploadPicture))
    .get('/:year/:month/:day/:size/:fileName', pictureController.getSinglePicture)
}
