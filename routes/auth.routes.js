const router = require('express').Router()

module.exports = (controllers, middlewares) => {
  const userController = controllers.userController
  const authMiddleware = middlewares.authMiddleware
  const pictureMiddleware = middlewares.pictureMiddleware

  router
    .post('/api/register', pictureMiddleware.uploadSingle('profilePicture'), userController.register)
    .post('/api/login', userController.login)
    .get('/api/testRoute', authMiddleware.isAuthenticated(), userController.testRoute)

  return router;
}
