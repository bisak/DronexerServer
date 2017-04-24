const fs = require('fs')
const path = require('path')

module.exports = function (data) {
  let controllers = {}

  fs.readdirSync(__dirname)
    .filter(x => x.includes('.controller'))
    .forEach(fileName => {
      let controllerName = `${fileName.split('.')[0]}Controller`
      controllers[controllerName] = require(path.join(__dirname, fileName))(data)
    })

  return controllers
}
