const util = require('../util')()
const fsUtil = util.fsUtil
const compressionUtil = util.compressionUtil

module.exports = (models) => {
  const User = models.userModel
  return {
    registerUser (newUser, profilePicture) {
      if (!profilePicture) {
        return User.create(newUser)
      }
      return compressionUtil.compressProfilePicture(profilePicture).then((compressedPicture) => {
        let profilePicName = fsUtil.joinDirectory('storage', 'profile_pictures', `${newUser.username}.jpg`)
        return fsUtil.writeFileToDisk(profilePicName, compressedPicture).then(() => {
          return User.create(newUser)
        })
      })
    },
    getUserById (id, selector) {
      return User.findById(id).select(selector)
    },
    getUserByUsername (username, selector) {
      return User.findOne().where('username').equals(username).select(selector)
    },
    getUsernamesByIds(ids){
      return User.find({'_id': ids}).lean().select('username')
    },
    getUserIdsByUsernames(usernames){
      return User.find({'username': usernames}).lean().select('_id')
    }
  }
}
