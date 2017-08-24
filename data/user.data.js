const util = require('../util')
const fsUtil = util.fsUtil
const compressionUtil = util.compressionUtil
const helperUtil = util.helperUtil

module.exports = (models) => {
  const User = models.userModel
  const Follow = models.followModel
  const Comment = models.commentModel

  return {
    registerUser(newUser) {
      delete newUser.roles
      newUser.drones = helperUtil.assignDroneNames(newUser.drones)
      return User.create(newUser)
    },
    getUserById(id, selector) {
      return User.findById(id).select(selector)
    },
    getUserByUsername(username, selector) {
      return User.findOne().where('username').equals(username).select(selector)
    },
    getUsernamesByIds(ids) {
      return User.find({ '_id': ids }).lean().select('username')
    },
    editUserById(userId, newData) {
      delete newData.roles
      newData.drones = helperUtil.assignDroneNames(newData.drones)
      return User.findByIdAndUpdate(userId, { $set: newData }, { new: true })
    },
    saveProfilePic(userId, profilePic) {
      return compressionUtil.compressAndSaveProfilePicture(profilePic, userId)
    },
    async deleteUser(user) {
      /* Remove the actual user document */
      User.remove({ _id: user._id }).exec()
      /* Remove the profile picture from storage */
      fsUtil.deleteFile(fsUtil.joinDirectory('..', fsUtil.profilePicPath, `${user._id}.jpg`)).then()
      /* Remove all comments by the user */
      Comment.remove({ user: user._id }).exec()
      /* Find everyone that is following the user and everyone that the user is following */
      let followers = await Follow.find({ followeeId: user._id }).distinct('followerId')
      let followees = await Follow.find({ followerId: user._id }).distinct('followeeId')
      /* Remove all follows */
      Follow.remove({ followerId: user._id }).exec()
      Follow.remove({ followeeId: user._id }).exec()
      /* Update evey user following/followers count */
      User.update({ _id: followers }, { $inc: { followeesCount: -1 } }).exec()
      User.update({ _id: followees }, { $inc: { followersCount: -1 } }).exec()
    },
    async followUser(followerId, followeeId) {
      let createdFollow = await Follow.create({ followerId, followeeId })
      if (createdFollow) {
        let promises = []
        promises.push(User.findOneAndUpdate({ _id: followerId }, { $inc: { followeesCount: 1 } }))
        promises.push(User.findOneAndUpdate({ _id: followeeId }, { $inc: { followersCount: 1 } }))
        return Promise.all(promises)
      }
      return Promise.resolve(null)
    },
    async unFollowUser(followerId, followeeId) {
      let dbResponse = await Follow.remove({ followerId, followeeId })
      if (dbResponse && dbResponse.result.ok && dbResponse.result.n) {
        let promises = []
        promises.push(User.findOneAndUpdate({ _id: followerId }, { $inc: { followeesCount: -1 } }))
        promises.push(User.findOneAndUpdate({ _id: followeeId }, { $inc: { followersCount: -1 } }))
        return Promise.all(promises)
      }
      return Promise.resolve(null)
    },
    isFollowed(followerId, followeeId) {
      if (!followeeId || !followerId) {
        return null
      }
      return Follow.findOne({ followerId, followeeId }).lean()
    }
  }
}
