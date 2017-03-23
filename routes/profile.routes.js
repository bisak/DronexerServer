const router = require('express').Router()

module.exports = (controllers, middlewares) => {
  const profileController = controllers.profileController;
  router
    .get('/api/users/profilePicture/:username', profileController.getProfilePicture)

  return router
}
