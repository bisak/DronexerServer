const router = require('express').Router()

module.exports = (controllers, middlewares) => {
  const authController = controllers.authController
  const authMiddleware = middlewares.authMiddleware
  const pictureMiddleware = middlewares.pictureMiddleware

  router
    .post('/api/register', pictureMiddleware.uploadSingle('profilePicture'), authController.register)
    .post('/api/login', authController.login)
    .get('/api/testRoute', authMiddleware.isAuthenticated(), authController.testRoute)

  return router;
}
