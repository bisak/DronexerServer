/* Start point */
require('./config/app')
let memwatch = require('memwatch-next')

memwatch.on('leak', function (info) {
  console.log('leak', info)
})

memwatch.on('stats', function (stats) {
  console.log('stats', stats)
})

let process = require('process')
console.log(process.pid)
