const postData = require('./post.data')
const userData = require('./user.data')
const searchData = require('./search.data')

module.exports = function (models) {
  return {
    postData: postData(models),
    userData: userData(models),
    searchData: searchData(models)
  }
}
