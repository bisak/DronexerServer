const postData = require('./post.data')
const userData = require('./user.data')

module.exports = function (models) {
  return {
    postData: postData(models),
    userData: userData(models)
  }
}
