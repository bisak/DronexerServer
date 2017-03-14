const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

const secrets = require('../secrets')

const opts = {
	jwtFromRequest: ExtractJwt.fromAuthHeader(),
	secretOrKey: secrets.passportSecret
}

module.exports = function (data) {
	const userData = data.userData

	const strategy = new JwtStrategy(opts, function (jwt_payload, done) {
		userData.getUserById(jwt_payload._doc._id)
			.then((user) => {
				user.password = undefined
				if (user) return done(null, user);
				return done(null, false);
			})
			.catch((err) => {
				return done(err, false);
			})
	});

	return strategy
}
