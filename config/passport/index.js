const passport = require('passport')

module.exports = (app, data) => {
	require('./passport-jwt.strategy')(passport, data)

	app.use(passport.initialize())
	app.use(passport.session())
}