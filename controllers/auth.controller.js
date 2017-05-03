const util = require('../util')()
const secrets = require('../config/secrets')
const jwt = require('jsonwebtoken')
const dateUtil = util.dateUtil
const encryptionUtil = util.encryptionUtil
const validatorUtil = util.validatorUtil

module.exports = function (data) {
  const userData = data.userData
  return {
    register (req, res) {
      let userToRegister = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        birthday: req.body.birthday,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        drones: req.body.drones
      }

      Object.keys(userToRegister).forEach(key => userToRegister[key] === undefined && delete userToRegister[key])

      let validateInput = validatorUtil.validateRegisterInput(userToRegister)

      if (!validateInput.isValid) {
        return res.status(400).json({
          success: false,
          msg: validateInput.msg
        })
      }

      let profilePicture = req.file
      if (profilePicture) {
        let profilePictureValidator = validatorUtil.validateProfilePicture(profilePicture)
        if (!profilePictureValidator.isValid) {
          return res.status(400).json({
            success: false,
            msg: profilePictureValidator.msg
          })
        }
      }

      return encryptionUtil.generateHash(userToRegister.password).then((hash) => {
        userToRegister.password = hash
        return userData.registerUser(userToRegister, profilePicture).then((registeredUser) => {
          let userToReturn = {
            data: registeredUser.toObject(),
            success: true
          }
          delete userToReturn.data.password
          res.json(userToReturn)
        })
      }).catch(function (error) {
        console.error(error)
        if (error.code === 11000) {
          return res.status(409).json({
            success: false,
            msg: `This user already exists.`
          })
        }
        return res.status(500).json({
          success: false,
          msg: `Unexpected error.`,
          err: error
        })
      })
    },
    login (req, res) {
      const username = req.body.username
      const password = req.body.password

      userData.getUserByUsername(username).then((foundUser) => {
        if (!foundUser) {
          return res.status(404).json({success: false, msg: 'User not found'})
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
          return res.status(400).json({success: false, msg: 'Wrong password'})
        })
      })
        .catch((error) => {
          console.error(error)
          return res.status(500).json({success: false, msg: 'Database error.', err: error})
        })
    },
    testRoute (req, res) {
      res.json({
        accessed: true,
        user: '123test'
      })
    }
  }
}
