const mongoose = require('mongoose')
const mongooseConfig = require('./mongoose.config')

module.exports = function (controllers) {
  mongoose.Promise = global.Promise
  const { botController } = controllers

  return mongoose.connect(mongooseConfig.connectionString, { useMongoClient: true }).then((success) => {
    mongoose.connection.on('disconnected', () => {
      console.error('Mongoose disconnected')
    })
    console.log('Mongoose connected at: ' + mongooseConfig.connectionString)
    return botController.createBotUser()

  }).catch((error) => {
    console.error('Mongoose connection error: ')
    console.error(error)
  })
}