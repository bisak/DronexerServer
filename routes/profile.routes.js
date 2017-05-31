const router = require('express').Router()

module.exports = (controllers, middlewares) => {
  const profileController = controllers.profileController
  const authMiddleware = middlewares.authMiddleware
  const pictureMiddleware = middlewares.pictureMiddleware

  return router
    .get('/profile-picture/:userId', profileController.getProfilePicture)
    .get('/profile-info/:username', profileController.getProfileInfo)
    .post('/edit-profile', authMiddleware.isAuthenticated(), pictureMiddleware.uploadSingle('profilePicture'), profileController.editProfileInfo)
    .post('/delete-profile', authMiddleware.isAuthenticated(), profileController.deleteProfile)
    .post('/follow/:userId', authMiddleware.isAuthenticated(), profileController.followUser)
    .post('/unfollow/:userId', authMiddleware.isAuthenticated(), profileController.unFollowUser)
}
