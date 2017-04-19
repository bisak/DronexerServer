const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

const secrets = require('../secrets')

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeader(),
  secretOrKey: secrets.passportSecret
}

module.exports = function (data) {
  const userData = data.userData

  return new JwtStrategy(opts, function (jwt_payload, done) {
    userData.getUserById(jwt_payload._doc._id, '-password')
      .then((user) => {
        if (user) return done(null, user);
        return done(null, false);
      })
      .catch((error) => {
        return done(error, false);
      })
  });

}
