const router = require('express').Router()
const errorCatcher = require('../util').errorCatcher

module.exports = (controllers, middlewares) => {
  const profileController = controllers.profileController
  const authMiddleware = middlewares.authMiddleware
  const pictureMiddleware = middlewares.pictureMiddleware

  return router
    .get('/profile-picture/:userId', profileController.getProfilePicture)
    .get('/profile-info/:username', authMiddleware.extractUserFromToken(), errorCatcher(profileController.getProfileInfo))
    .post('/edit-profile', authMiddleware.isAuthenticated(), pictureMiddleware.uploadSingle('profilePicture'), profileController.editProfileInfo)
    .post('/delete-profile', authMiddleware.isAuthenticated(), errorCatcher(profileController.deleteProfile))
    .post('/follow/:userId', authMiddleware.isAuthenticated(), errorCatcher(profileController.followUser))
    .post('/unfollow/:userId', authMiddleware.isAuthenticated(), errorCatcher(profileController.unFollowUser))
}
