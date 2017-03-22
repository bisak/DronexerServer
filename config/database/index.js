const mongoose = require('mongoose')
const mongooseConfig = require('./mongoose.config')

mongoose.Promise = global.Promise
mongoose.connect(mongooseConfig.connectionString)

mongoose.connection.on('connected', function () {
  console.log('Mongoose connected at: ' + mongooseConfig.connectionString);
});

mongoose.connection.on('error', function (err) {
  console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
  console.log('Mongoose disconnected');
});
