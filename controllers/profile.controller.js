const util = require('../util')
const secrets = require('../config/secrets')
const jwt = require('jsonwebtoken')
const dateUtil = util.dateUtil
const encryptionUtil = util.encryptionUtil
const validatorUtil = util.validatorUtil
const fsUtil = util.fsUtil

module.exports = function (data) {
  const userData = data.userData
  const postData = data.postData
  return {
    getProfilePicture (req, res) {
      const { userId } = req.params
      res.sendFile(fsUtil.joinDirectory(fsUtil.profilePicPath, `${userId}.jpg`), {root: '../'}, (error1) => {
        if (error1) {
          res.sendFile(fsUtil.joinDirectory(fsUtil.logosPath, `default_profile_picture.jpg`), {root: '../'}, (error2) => {
            if (error2) {
              return res.status(404).json({
                success: false,
                msg: 'Error finding profile picture.',
                err: error2
              })
            }
          })
        }
      })
    },
    getProfileInfo (req, res) {
      const { username } = req.params

      userData.getUserIdsByUsernames(username).then(retrievedUser => {
        if (!retrievedUser.length) {
          return res.status(404).json({
            success: false,
            msg: 'User not found.'
          })
        }
        let profileData = userData.getUserByUsername(username, '-password -roles')
        let userPostsCount = postData.getPostsCountById(retrievedUser[0]._id)
        return Promise.all([profileData, userPostsCount]).then(retrievedData => {
          let retrievedUser = retrievedData[0]
          let retrievedPicCount = retrievedData[1]

          let objToReturn = retrievedUser.toObject()
          /* TODO fix this will eat memory. (use .count in mongoose) and exclude the following/followers fields */
          objToReturn.followersCount = objToReturn.followers.length
          objToReturn.followingCount = objToReturn.following.length
          objToReturn.postsCount = retrievedPicCount
          delete objToReturn.followers
          delete objToReturn.following
          return res.json({
            data: objToReturn,
            success: true
          })
        })
      }).catch((error) => {
        console.error(error)
        return res.status(500).json({
          success: false,
          msg: 'Server error.'
        })
      })
    },
    editProfileInfo (req, res) {
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
          return res.status(500).json({success: false, msg: 'Error editing user.'})
        }
        return encryptionUtil.comparePassword(candidateEditData.oldPassword, foundUser.password).then((isMatch) => {
          if (!isMatch) return res.status(400).json({success: false, msg: 'Wrong password'})
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
    deleteProfile (req, res) {
      let user = req.user
      let oldPassword = req.body.oldPassword

      if (!oldPassword) {
        return res.status(400).json({
          success: false,
          msg: 'Password empty.'
        })
      }

      return userData.getUserByUsername(user.username, 'password').then((foundUser) => {
        if (!foundUser) {
          return res.status(500).json({success: false, msg: 'Error deleting user.'})
        }
        return encryptionUtil.comparePassword(oldPassword, foundUser.password).then((isMatch) => {
          if (!isMatch) {
            return res.status(400).json({
              success: false,
              msg: 'Wrong password.'
            })
          }
          let deleteUserPromise = userData.deleteUser(user)
          let deletePicturesPromise = postData.deleteAllUserPosts(user)
          return Promise.all([deleteUserPromise, deletePicturesPromise]).then((dbResponse) => {
            return res.json({
              success: true,
              msg: 'Successfully deleted user and pictures.'
            })
          })
        })
      }).catch((error) => {
        console.error(error)
        return res.status(500).json({
          success: false,
          msg: 'Error deleting user.',
          err: error
        })
      })
    }
  }
}
