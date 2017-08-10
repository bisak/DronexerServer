const router = require('express').Router()
const errorCatcher = require('../util').errorCatcher

module.exports = (controllers, middlewares) => {
  const authController = controllers.authController
  const pictureMiddleware = middlewares.pictureMiddleware

  router
    .post('/register', pictureMiddleware.uploadSingle('profilePicture'), authController.register)
    .post('/login', authController.login)

  return router
}
