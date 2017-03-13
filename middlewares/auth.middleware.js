const passport = require('passport')
const jwt = require('jsonwebtoken')

module.exports = {
	isInRole(role) {
		if (!role) role = 'admin'
		return (req, res, next) => {
			passport.authenticate('jwt', { session: false }, function (error, user, info) {
				if (error) {
					return next(error);
				}
				if (!user || !(user.roles.includes(role))) {
					return res.status(401).json({
						success: false,
						message: 'Unauthorized!'
					});
				}
				next()
			})(req, res, next)
		}
	},
	isAuthenticated(req, res, next) {
		passport.authenticate('jwt', { session: false }, function (error, user, info) {
			if (error) {
				return next(error);
			}
			if (!user) {
				return res.status(401).json({
					success: false,
					message: 'Unauthorized!'
				});
			}
			next()
		})(req, res, next)
	}
}