const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

const secrets = require('../secrets')

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'),
  secretOrKey: secrets.passportSecret
}

module.exports = function (data) {
  const userData = data.userData

  return new JwtStrategy(opts, function (payload, done) {
    userData.getUserById(payload._id, '-password -drones -followeesCount -followersCount -firstName -lastName -updatedAt -createdAt -birthday -__v')
      .then((user) => {
        if (user) return done(null, user)
        return done(null, false)
      })
      .catch((error) => {
        return done(error, false)
      })
  })
}
