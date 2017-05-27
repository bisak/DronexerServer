const authController = require('./auth.controller')
const defaultController = require('./default.controller')
const postController = require('./post.controller')
const profileController = require('./profile.controller')
const pictureController = require('./picture.controller')

module.exports = function (data) {
  return {
    authController: authController(data),
    defaultController: defaultController(data),
    postController: postController(data),
    profileController: profileController(data),
    pictureController: pictureController(data)
  }
}
