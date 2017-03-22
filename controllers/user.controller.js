const passport = require('passport')
const validator = require('validator')
const encryption = require('../util')().encryptionUtil
const secrets = require('../config/secrets')
const jwt = require('jsonwebtoken')

module.exports = function (data) {
  const userData = data.userData;
  return {
    register(req, res){
      console.log(req.body)
      console.log(req.file)
      let newUser = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        birthdate: req.body.birthday,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        drones: req.body.drones
      }

      Object.keys(newUser).forEach(key => newUser[key] === undefined && delete newUser[key])
      console.log(newUser)
      if (req.body.superSecretPassword &&
        req.body.superSecretPassword == secrets.superSecretPassword) {
        newUser.roles = req.body.roles
      }

      //FROM HERE
      /*TODO fix (move) validations.*/
      if (!validator.isEmail(newUser.email)) {
        return res.json({
          success: false,
          msg: `Invalid email address.`,
        })
      }

      if (!validator.isLength(newUser.password, { min: 6, max: 50 })) {
        return res.json({
          success: false,
          msg: `Weak password.`,
        })
      }

      if (validator.isEmpty(newUser.username)) {
        return res.json({
          success: false,
          msg: `Empty username.`,
        })
      }

      if (newUser.firstName) newUser.firstName = validator.escape(newUser.firstName)
      if (newUser.lastName) newUser.lastName = validator.escape(newUser.lastName)
      newUser.email = validator.escape(newUser.email)
      newUser.username = validator.escape(newUser.username)
      //TO HERE


      userData.registerUser(newUser)
        .then(function (dbUser) {
          let userToReturn = JSON.parse(JSON.stringify(dbUser)) //LOL...
          userToReturn.password = undefined
          userToReturn.success = true
          res.json(userToReturn)
        })
        .catch(function (error) {
          console.log(error)
          if (error.code === 11000) {
            return res.status(409).json({
              success: false,
              msg: `This user already exists.`,
            })
          }
          return res.status(500).json({
            success: false,
            msg: `Database error: ${error.message}`,
          })
        })
    },
    login(req, res){
      const username = req.body.username
      const password = req.body.password

      userData.getUserByUsername(username)
        .then((foundUser) => {
          if (!foundUser) {
            return res.status(404).json({ success: false, msg: 'User not found' })
          }
          encryption.comparePassword(password, foundUser.password) /*TODO think about moving that to the data(model) layer*/
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
              return res.status(400).json({ success: false, msg: 'Wrong password' })
            })
        })
        .catch((err) => {
          console.log(err)
          return res.status(500).json({ success: false, msg: 'Database error.', err: err })
        })
    },
    testRoute(req, res){
      res.json({
        accessed: true,
        user: "123test"
      })
    }
  }
}
