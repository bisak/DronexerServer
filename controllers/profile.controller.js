const util = require('../util')
const secrets = require('../config/secrets')
const jwt = require('jsonwebtoken')
const dateUtil = util.dateUtil
const encryptionUtil = util.encryptionUtil
const validatorUtil = util.validatorUtil
const fsUtil = util.fsUtil

module.exports = (data) => {
  const userData = data.userData
  const postData = data.postData
  return {
    getProfilePicture(req, res) {
      const { userId } = req.params
      res.sendFile(fsUtil.joinDirectory(fsUtil.profilePicPath, `${userId}.jpg`), { root: '../' }, (error) => {
        if (error) {
          res.sendFile(fsUtil.joinDirectory(fsUtil.logosPath, `default-profile-pic.png`), { root: '../' }, (error) => {
            if (error) {
              return res.status(404).json({
                success: false,
                msg: 'Error finding profile picture.',
                err: error
              })
            }
          })
        }
      })
    },
    async getProfileInfo(req, res) {
      const { username } = req.params
      const loggedInUser = req.user
      let retrievedRequestedUserData = await userData.getUserByUsername(username, '-password -roles')
      if (!retrievedRequestedUserData) {
        return res.status(404).json({ success: false, msg: 'User not found.' })
      }
      let objToReturn = retrievedRequestedUserData.toObject()

      if (loggedInUser) {
        objToReturn.isFollowed = await userData.isFollowed(loggedInUser._id, retrievedRequestedUserData._id)
      }

      return res.json({
        data: objToReturn,
        success: true
      })
    },
    editProfileInfo(req, res) {
      let candidateEditData = JSON.parse(req.body.data)
      let oldUserData = req.user
      let profilePicture = req.file

      let validateInput = validatorUtil.validateRegisterInput(candidateEditData, true)
      if (!validateInput.isValid) {
        return res.status(400).json({
          success: false,
          msg: validateInput.msg
        })
      }

      if (profilePicture) {
        let profilePictureValidator = validatorUtil.validateProfilePicture(profilePicture)
        if (!profilePictureValidator.isValid) {
          return res.status(400).json({
            success: false,
            msg: profilePictureValidator.msg
          })
        }
      }

      userData.getUserByUsername(oldUserData.username, 'password').then((foundUser) => {
        if (!foundUser) {
          return res.status(500).json({ success: false, msg: 'Error editing user.' })
        }
        return encryptionUtil.comparePassword(candidateEditData.oldPassword, foundUser.password).then((isMatch) => {
          if (!isMatch) return res.status(400).json({ success: false, msg: 'Wrong password' })
          if (candidateEditData.password) {
            return encryptionUtil.generateHash(candidateEditData.password).then((hash) => {
              candidateEditData.password = hash
              return userData.editUserById(oldUserData._id, candidateEditData, profilePicture).then(editedData => {
                if (profilePicture) {
                  return userData.saveProfilePic(oldUserData._id, profilePicture).then(() => {
                    const token = jwt.sign(editedData, secrets.passportSecret)
                    return res.json({
                      success: true,
                      token: 'JWT ' + token,
                      msg: 'Edited successfully.'
                    })
                  })
                } else {
                  delete editedData.password
                  const token = jwt.sign(editedData, secrets.passportSecret)
                  return res.json({
                    success: true,
                    token: 'JWT ' + token,
                    msg: 'Edited successfully.'
                  })
                }
              })
            })
          } else {
            delete candidateEditData.password
            return userData.editUserById(oldUserData._id, candidateEditData).then(editedData => {
              delete editedData.password
              if (profilePicture) {
                return userData.saveProfilePic(oldUserData._id, profilePicture).then(() => {
                  const token = jwt.sign(editedData, secrets.passportSecret)
                  return res.json({
                    success: true,
                    token: 'JWT ' + token,
                    msg: 'Edited successfully.'
                  })
                })
              } else {
                const token = jwt.sign(editedData, secrets.passportSecret)
                return res.json({
                  success: true,
                  token: 'JWT ' + token,
                  msg: 'Edited successfully.'
                })
              }
            })
          }
        })
      }).catch(error => {
        console.error(error)
        return res.status(500).json({
          success: false,
          msg: 'Error editing user.',
          err: error
        })
      })
    },
    async deleteProfile(req, res) {
      let user = req.user
      let oldPassword = req.body.oldPassword

      if (!oldPassword) {
        return res.status(400).json({
          success: false,
          msg: 'Password empty.'
        })
      }

      let foundUser = await userData.getUserByUsername(user.username, 'password')
      if (!foundUser) {
        return res.status(400).json({ success: false, msg: 'Bad credentials' })
      }
      let isMatch = await encryptionUtil.comparePassword(oldPassword, foundUser.password)
      if (!isMatch) {
        return res.status(400).json({ success: false, msg: 'Bad credentials' })
      }
      userData.deleteUser(user)
      postData.deleteAllUserPosts(user)
      return res.json({
        success: true,
        msg: 'Successfully deleted user and pictures.'
      })
    },
    async followUser(req, res) {
      const userToFollowId = req.params.userId
      const userId = req.user._id
      await userData.followUser(userId, userToFollowId)
      return res.json({
        success: true,
        msg: 'Successfully followed user.'
      })
    },
    async unFollowUser(req, res) {
      const userToUnFollowId = req.params.userId
      const userId = req.user._id
      await userData.unFollowUser(userId, userToUnFollowId)
      return res.json({
        success: true,
        msg: 'Successfully unfollowed user.'
      })
    }
  }
}
