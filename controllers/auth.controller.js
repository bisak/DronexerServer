const util = require('../util')
const secrets = require('../config/secrets')
const jwt = require('jsonwebtoken')
const encryptionUtil = util.encryptionUtil
const validatorUtil = util.validatorUtil

module.exports = function (data) {
  const userData = data.userData
  return {
    async register(req, res) {
      let parsedJson = JSON.parse(req.body.data)
      let profilePicture = req.file

      let userToRegister = {
        username: parsedJson.username,
        firstName: parsedJson.firstName,
        lastName: parsedJson.lastName,
        email: parsedJson.email,
        password: parsedJson.password,
        drones: parsedJson.dronesSelected
      }

      let validateInput = validatorUtil.validateRegisterInput(userToRegister)
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

      try {
        userToRegister.password = await encryptionUtil.generateHash(userToRegister.password)
        const registeredUser = await userData.registerUser(userToRegister)
        if (profilePicture) {
          await userData.saveProfilePic(registeredUser._id, profilePicture)
        }
        res.json({ success: true })
      } catch (error) {
        console.error(error)
        if (error.code === 11000) {
          return res.status(409).json({
            success: false,
            msg: `This user already exists.`
          })
        }
        return res.status(500).json({
          success: false,
          msg: `Unexpected error.`
        })
      }
    },
    login(req, res) {
      const {username, password} = req.body

      userData.getUserByUsername(username).then((foundUser) => {
        if (!foundUser) {
          return res.status(404).json({ success: false, msg: 'User not found' })
        }
        return encryptionUtil.comparePassword(password, foundUser.password).then((isMatch) => {
          if (isMatch) {
            foundUser.password = undefined
            const token = jwt.sign(foundUser, secrets.passportSecret)
            return res.json({
              success: true,
              token: 'JWT ' + token
            })
          }
          return res.status(400).json({ success: false, msg: 'Wrong password' })
        })
      }).catch((error) => {
        console.error(error)
        return res.status(500).json({ success: false, msg: 'Database error.', err: error })
      })
    }
  }
}
