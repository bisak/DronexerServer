const passport = require('passport')
const jwt = require('jsonwebtoken')

module.exports = () => {
  return {
    isAuthenticated(role) {
      if (!role) role = 'normal'
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
          req.user = user
          next()
        })(req, res, next)
      }
    }
  }
}
