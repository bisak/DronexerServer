const util = require('../util')
const fsUtil = util.fsUtil
const compressionUtil = util.compressionUtil

module.exports = (models) => {
  const User = models.userModel
  const Follow = models.followModel

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
      return User.find({ '_id': ids }).lean().select('username')
    },
    getUserIdsByUsernames (usernames) {
      return User.find({ 'username': usernames }).lean().select('_id')
    },
    editUserById (userId, newData) {
      return User.findByIdAndUpdate(userId, { $set: newData }, { new: true })
    },
    saveProfilePic (userId, profilePic) {
      return compressionUtil.compressProfilePicture(profilePic, userId)
    },
    deleteUser (userToDelete) {
      return User.remove({ _id: userToDelete._id })
    },
    followUser (followerId, followeeId) {
      return Follow.find({ followerId, followeeId }).then((dataThatSouldntExist) => {
        if (!dataThatSouldntExist.length) {
          return Follow.create({ followerId, followeeId }).then(() => {
            let promises = []
            promises.push(User.findOneAndUpdate({ _id: followerId }, { $inc: { followeesCount: 1 } }))
            promises.push(User.findOneAndUpdate({ _id: followeeId }, { $inc: { followersCount: 1 } }))
            return Promise.all(promises)
          })
        }
      })
    },
    unFollowUser (followerId, followeeId) {
      return Follow.remove({ followerId, followeeId }).then((dbResponse) => {
        console.log(dbResponse)
        if (dbResponse && dbResponse.result.ok && dbResponse.result.n === 1) {
          let promises = []
          promises.push(User.findOneAndUpdate({ _id: followerId }, { $inc: { followeesCount: -1 } }))
          promises.push(User.findOneAndUpdate({ _id: followeeId }, { $inc: { followersCount: -1 } }))
          return Promise.all(promises)
        }
      })
    },
    isFollowed (followerId, followeeId) {
      return Follow.find({ followerId, followeeId })
    }
  }
}
