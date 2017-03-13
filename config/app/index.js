const appConfig = require('./app.config')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

const app = express();

app.use(bodyParser.json())
app.use(cors())
app.use(express.static('public'))
app.use(morgan('dev'))

const data = require('../../data')

require('../../routes')(app, data)
require('../passport')(app, data)

module.exports = {
	app,
	appConfig
}
