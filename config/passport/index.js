const passport = require('passport')

module.exports = (data) => {
  const strategy = require('./passport-jwt.strategy')(data)
  passport.use(strategy)
  return passport
}
