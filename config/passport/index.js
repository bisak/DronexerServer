const passport = require('passport')

module.exports = (app, data) => {
  const strategy = require('./passport-jwt.strategy')(data)

  passport.use(strategy)

  app.use(passport.initialize())
  app.use(passport.session())
}
