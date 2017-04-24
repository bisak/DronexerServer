const fs = require('fs')
const path = require('path')

module.exports = function (controllers, middlewares) {
  let routes = {}

  fs.readdirSync(__dirname)
    .filter(x => x.includes(".routes"))
    .forEach(file => {
      let routeName = `${file.split('.')[0]}Routes`;
      routes[routeName] = require(path.join(__dirname, file))(controllers, middlewares)
    });

  return routes
}
