/* Require app dependencies */
const appConfig = require('./app.config')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const helmet = require('helmet')
const environments = require('../environments')

/* Express, you know the deal */
const app = express()

/* Apply modules */
app.use(helmet())
app.use(bodyParser.json())
app.use(express.static('public'))
app.use(morgan('common'))

if (!environments.production) {
  app.use(cors())
  app.use(helmet.noCache())
}

const models = require('../../models')
const data = require('../../data')(models)
const controllers = require('../../controllers')(data)
const middlewares = require('../../middlewares')()

/* Initialize passport and it's strategy */
const passport = require('../passport')(data)
app.use(passport.initialize())
app.use(passport.session())

/* Handle routing */
const routes = require('../../routes')(controllers, middlewares)
app.use('/api/auth', routes.authRoutes)
app.use('/api/posts', routes.postRoutes)
app.use('/api/users', routes.profileRoutes)
app.use('/api/pictures', routes.pictureRoutes)
app.use(routes.defaultRoutes)

/* Start listening to the port defined in the app config */
app.listen(appConfig.port, () => {
  console.log(`Server listening on port: ${appConfig.port}`)
  require('../database')
})

/* Error handling */
app.use((err, req, res, next) => {
  console.error(err)
  return res.status(500).json({
    success: false,
    msg: 'An unknown error occured'
  })
})