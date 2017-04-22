const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

const secrets = require('../secrets')

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeader(),
  secretOrKey: secrets.passportSecret
}

module.exports = function (data) {
  const userData = data.userData
  console.log("hereisam")

  return new JwtStrategy(opts, function (jwt_payload, done) {
    userData.getUserById(jwt_payload._doc._id, '-password')
      .then((user) => {
      console.log("then")
        if (user) return done(null, user);
        return done(null, false);
      })
      .catch((error) => {
      console.log("catch")
        return done(error, false);
      })
  });

}
