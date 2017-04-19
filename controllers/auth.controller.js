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
      let newUser = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        birthday: req.body.birthday,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        drones: req.body.drones
      }

      Object.keys(newUser).forEach(key => newUser[key] === undefined && delete newUser[key])

      // backdoor for making admins
      if (req.body.superSecretPassword && req.body.superSecretPassword === secrets.superSecretPassword) {
        newUser.roles = req.body.roles
      }

      let validateInput = validatorUtil.validateRegisterInput(newUser)
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
          res.status(400).json({
            success: false,
            msg: profilePictureValidator.msg
          })
        }
      }

      newUser.firstName = validatorUtil.validator.escape(newUser.firstName)
      newUser.lastName = validatorUtil.validator.escape(newUser.lastName)
      newUser.email = validatorUtil.validator.escape(newUser.email)
      newUser.username = validatorUtil.validator.escape(newUser.username)
      /* TODO add escaping everywhere. */

      encryptionUtil.generateHash(newUser.password).then((hash) => {
        newUser.password = hash
        newUser.dateRegistered = dateUtil.getCurrentDateString()
        return userData.registerUser(newUser, profilePicture).then((dbUser) => {
          let userToReturn = {}
          userToReturn.data = dbUser.toObject()
          delete userToReturn.data.password
          userToReturn.success = true
          res.json(userToReturn)
        })
      }).catch(function (error) {
        console.log(error)
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

      userData.getUserByUsername(username)
        .then((foundUser) => {
          if (!foundUser) {
            return res.status(404).json({success: false, msg: 'User not found'})
          }
          encryptionUtil.comparePassword(password, foundUser.password)
            .then((isMatch) => {
              if (isMatch) {
                foundUser.password = undefined
                const token = jwt.sign(foundUser, secrets.passportSecret)
                return res.json({
                  success: true,
                  token: 'JWT ' + token,
                  user: foundUser
                })
              }
              return res.status(400).json({success: false, msg: 'Wrong password'})
            })
        })
        .catch((error) => {
          console.log(error)
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
