const router = require('express').Router()

module.exports = (controllers, middlewares) => {
  const authController = controllers.authController
  const authMiddleware = middlewares.authMiddleware
  const pictureMiddleware = middlewares.pictureMiddleware

  router
    .post('/register', pictureMiddleware.uploadSingle('profilePicture'), authController.register)
    .post('/login', authController.login)
    .get('/testRoute', authMiddleware.isAuthenticated(), authController.testRoute)

  return router;
}
