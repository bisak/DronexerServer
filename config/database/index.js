const mongoose = require('mongoose');
const mongooseConfig = require('./mongoose.config');

mongoose.Promise = global.Promise;

mongoose.connect(mongooseConfig.connectionString).then((success) => {
  console.log('Mongoose connected at: ' + mongooseConfig.connectionString);
}).catch((error) => {
  console.error('Mongoose connection error: ');
  console.error(error);
})

mongoose.connection.on('disconnected', () => {
  console.error('Mongoose disconnected');
});
