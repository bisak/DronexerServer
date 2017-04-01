const appConfig = require('./app.config')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const helmet = require('helmet')

const app = express();
app.use(helmet())
app.use(bodyParser.json())
app.use(cors())
app.use(express.static('public'))
app.use(morgan('dev'))

const models = require('../../models')()
const data = require('../../data')(models)
const controllers = require('../../controllers')(data)
const middlewares = require('../../middlewares')()

require('../../routes')(app, controllers, middlewares)
require('../passport')(app, data)

//Start listening
app.listen(appConfig.port, function () {
  console.log(`Server listening on port: ${appConfig.port}`)
})
