const router = require('express').Router()

module.exports = (controllers, middlewares) => {
  const profileController = controllers.profileController;

  router
    .get('/profilePicture/:username', profileController.getProfilePicture)
    .get('/profileInfo/:username', profileController.getProfileInfo)

  return router
}
