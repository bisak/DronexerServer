/* Start point */
require('./config/app')

let process = require('process')
setInterval(() => {
  let mem = process.memoryUsage()
  console.log('heap', mem.heapTotal / 1024 / 1024, 'mb')
  console.log('ext', mem.external / 1024 / 1024, 'mb')
  console.log()
}, 2000)
