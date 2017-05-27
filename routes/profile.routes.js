const router = require('express').Router()

module.exports = (controllers, middlewares) => {
  const profileController = controllers.profileController
  const authMiddleware = middlewares.authMiddleware
  const pictureMiddleware = middlewares.pictureMiddleware

  router
    .get('/profile-picture/:userId', profileController.getProfilePicture)
    .get('/profile-info/:username', profileController.getProfileInfo)
    .post('/edit-profile', authMiddleware.isAuthenticated(), pictureMiddleware.uploadSingle('profilePicture'), profileController.editProfileInfo)
    .post('/delete-profile', authMiddleware.isAuthenticated(), profileController.deleteProfile)
  return router
}
