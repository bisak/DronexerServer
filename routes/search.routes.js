const router = require('express').Router()
const errorCatcher = require('../util').errorCatcher

module.exports = (controllers, middlewares) => {
  const searchController = controllers.searchController
  const authMiddleware = middlewares.authMiddleware

  return router
    .get('/tags', errorCatcher(searchController.searchForTag))
    .get('/users', errorCatcher(searchController.searchForUser))
}
