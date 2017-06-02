const passport = require('passport')
const jwt = require('jsonwebtoken')

module.exports = () => {
  return {
    isAuthenticated (role) {
      if (!role) role = 'normal'
      return (req, res, next) => {
        passport.authenticate('jwt', {session: false}, (error, user, info) => {
          if (error) {
            return next(error)
          }
          if (!user || !user.roles.includes(role)) {
            return res.status(401).json({
              success: false,
              msg: 'Unauthorized!'
            })
          }
          req.user = user
          next()
        })(req, res, next)
      }
    },
    extractUserFromToken () {
      return (req, res, next) => {
        let authHeader = req.header('Authorization')
        if (authHeader) {
          /* Removes the "JWT " prefix */
          const authToken = authHeader.substring(3).trim()
          const decodedToken = jwt.decode(authToken)
          if (decodedToken) { req.user = decodedToken._doc }
        }
        return next()
      }
    }
  }
}
