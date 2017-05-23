const util = require('../util')
const fsUtil = util.fsUtil
const compressionUtil = util.compressionUtil

module.exports = (models) => {
  const User = models.userModel
  return {
    registerUser (newUser) {
      return User.create(newUser)
    },
    getUserById (id, selector) {
      return User.findById(id).select(selector)
    },
    getUserByUsername (username, selector) {
      return User.findOne().where('username').equals(username).select(selector)
    },
    getUsernamesByIds (ids) {
      return User.find({'_id': ids}).lean().select('username')
    },
    getUserIdsByUsernames (usernames) {
      return User.find({'username': usernames}).lean().select('_id')
    },
    editUserById (userId, newData) {
      return User.findByIdAndUpdate(userId, {$set: newData}, {new: true})
    },
    saveProfilePic (userId, profilePic) {
      return compressionUtil.compressProfilePicture(profilePic).then((compressedPicture) => {
        let profilePicName = fsUtil.joinDirectory('..', fsUtil.profilePicPath, `${userId}.jpg`)
        return fsUtil.writeFileToDisk(profilePicName, compressedPicture)
      })
    },
    deleteUser (userToDelete) {
      return User.remove({_id: userToDelete._id})
    }
  }
}

/* TODO change profile pictures filenames to profile ids */
