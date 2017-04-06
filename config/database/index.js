const mongoose = require('mongoose')
const mongooseConfig = require('./mongoose.config')

mongoose.Promise = global.Promise

mongoose.connect(mongooseConfig.connectionString).then((success) => {
  console.log('Mongoose connected at: ' + mongooseConfig.connectionString);
}).catch((err) => {
  console.log('Mongoose connection error: ' + err);
})

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});
