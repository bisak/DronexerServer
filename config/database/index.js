const mongoose = require('mongoose')
const mongooseConfig = require('./mongoose.config')

mongoose.connect(mongooseConfig.connectionString)
mongoose.Promise = global.Promise

mongoose.connection.on('connected', function () {
	console.log('Mongoose connected at: ' + mongooseConfig.connectionString);
});

mongoose.connection.on('error',function (err) {
	console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
	console.log('Mongoose disconnected');
});



