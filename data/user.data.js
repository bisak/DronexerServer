const util = require('../util')()
const fsUtil = util.fsUtil
const compressionUtil = util.compressionUtil

module.exports = (models) => {
  const User = models.userModel
  return {
    registerUser(newUser, profilePicture){
      if (!profilePicture) {
        return User.create(newUser)
      }
      return compressionUtil.compressProfilePicture(profilePicture).then((compressedPicture) => {
        let profilePicName = fsUtil.joinDirectory('storage', 'profile_pictures', `${newUser.username}.jpg`)
        return fsUtil.writeFileToDisk(profilePicName, compressedPicture).then(() => {
          newUser.hasProfilePicture = true;
          return User.create(newUser)
        })
      })
    },
    getUserById(id){
      return User.findById(id)
    },
    getUserByUsername(username, without){
      return User.findOne().where('username').equals(username).select(without)
    }
  }
}