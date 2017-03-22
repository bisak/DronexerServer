const util = require('../util')()
const encryption = util.encryptionUtil

module.exports = (models) => {
  const User = models.userModel
  return {
    registerUser(newUser){
      return encryption.generateHash(newUser.password)
        .then((hash) => {
          newUser.password = hash
          return User.create(newUser)
        })
    },
    getUserById(id){
      return User.findById(id)
    },
    getUserByUsername(username){
      return User.findOne().where('username').equals(username)
    }
  }
}