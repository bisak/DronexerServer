const util = require('../util')
const secrets = require('../config/secrets')
const jwt = require('jsonwebtoken')
const encryptionUtil = util.encryptionUtil

module.exports = function (data) {
  const userData = data.userData
  return {
    async createBotUser() {
      let userToRegister = {
        username: 'DronexerBot',
        firstName: 'I am',
        lastName: 'a bot',
        email: 'thebot@dronexer.com',
        password: await encryptionUtil.generateHash(secrets.botPassword),
        drones: util.helperUtil.dronesArray.length - 1
      }

      try {
        const registeredUser = await userData.registerUser(userToRegister)
        console.log('Bot created')
      } catch (error) {
        if (error.code === 11000) {
          console.log('The bot exists')
        }else{
          console.log(`Couldn't create the dronexer bot`)
s        }
      }
    }
  }
}
