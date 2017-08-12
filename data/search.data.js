const util = require('../util')
const mongooseConfig = require('../config/database/mongoose.config')

module.exports = (models) => {
  const Post = models.postModel
  const Follow = models.followModel
  const Comment = models.commentModel
  const User = models.userModel

  return {
    searchTags(tag, selector) {
      return Post.count({ tags: tag }).select(selector)
    },
    searchUserByUsername(username){
      return User.find({username: new RegExp(username, 'i')}).limit(mongooseConfig.searchResultsPerRequest)
    }
  }
}
