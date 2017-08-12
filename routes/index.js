const defaultRoutes = require('./default.routes')
const postRoutes = require('./post.routes')
const profileRoutes = require('./profile.routes')
const authRoutes = require('./auth.routes')
const pictureRoutes = require('./picture.routes')
const searchRoutes = require('./search.routes')

module.exports = function (controllers, middlewares) {
  return {
    authRoutes: authRoutes(controllers, middlewares),
    defaultRoutes: defaultRoutes(controllers, middlewares),
    postRoutes: postRoutes(controllers, middlewares),
    profileRoutes: profileRoutes(controllers, middlewares),
    pictureRoutes: pictureRoutes(controllers, middlewares),
    searchRoutes: searchRoutes(controllers, middlewares)
  }
}
