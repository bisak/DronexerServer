const util = require('../util')()
const secrets = require('../config/secrets')
const jwt = require('jsonwebtoken')
const dateUtil = util.dateUtil
const encryptionUtil = util.encryptionUtil
const validatorUtil = util.validatorUtil

module.exports = function (data) {
  const userData = data.userData
  const postData = data.postData
  return {
    getProfilePicture (req, res) {
      const username = req.params.username
      res.sendFile(`${username}.jpg`, {root: './storage/profile_pictures'}, (error1) => {
        if (error1) {
          res.sendFile(`default_profile_picture.jpg`, {root: './logos'}, (error2) => {
            if (error2) {
              res.status(404).json({
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
      /*Change this to work with ids*/
      const username = req.params.username

      userData.getUserIdsByUsernames(username).then(retrievedUser => {
        if (retrievedUser) {
          let profileData = userData.getUserByUsername(username, '-password -roles')
          let userPicturesCount = postData.getPicturesCountById(retrievedUser[0]._id)
          return Promise.all([profileData, userPicturesCount]).then(retrievedData => {
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
        }
        return res.status(404).json({
          success: false,
          msg: 'User not found.'
        })
      }).catch((error) => {
        console.error(error)
        return res.status(500).json({
          success: false,
          msg: 'Server error.'
        })
      })
    },
    editProfileInfo(req, res){
      let candidateEditData = JSON.parse(req.body.data)
      console.log(candidateEditData)
      let oldUserData = req.user

      let validateInput = validatorUtil.validateRegisterInput(candidateEditData, true)

      if (!validateInput.isValid) {
        return res.status(400).json({
          success: false,
          msg: validateInput.msg
        })
      }

      userData.getUserByUsername(oldUserData.username, 'password').then((foundUser) => {
        if (!foundUser) {
          return res.status(500).json({success: false, msg: 'Error editing user.'})
        }
        return encryptionUtil.comparePassword(candidateEditData.oldPassword, foundUser.password).then((isMatch) => {
          if (isMatch) {
            if (candidateEditData.password) {
              return encryptionUtil.generateHash(candidateEditData.password).then((hash) => {
                candidateEditData.password = hash
                return userData.editUserById(oldUserData._id, candidateEditData).then(editedData => {
                  console.log(editedData)
                  editedData.password = undefined
                  const token = jwt.sign(editedData, secrets.passportSecret)
                  return res.json({
                    success: true,
                    token: 'JWT ' + token,
                    msg: 'Edited successfully.'
                  })
                })
              })
            }
            delete candidateEditData.password
            return userData.editUserById(oldUserData._id, candidateEditData).then(editedData => {
              console.log(editedData)
              editedData.password = undefined
              const token = jwt.sign(editedData, secrets.passportSecret)
              return res.json({
                success: true,
                token: 'JWT ' + token,
                msg: 'Edited successfully.'
              })
            })
          }
          return res.status(400).json({success: false, msg: 'Wrong password'})
        })
      }).catch(error => {
        console.error(error)
        return res.status(500).json({
          success: false,
          msg: 'Error editing user.',
          err: error
        })
      })
    }
  }
}
