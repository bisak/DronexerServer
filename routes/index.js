const fs = require('fs')
const path = require('path')

module.exports = function (app, controllers, middlewares) {
  let routes = {}

  fs.readdirSync(__dirname)
    .filter(x => x.includes(".routes"))
    .forEach(file => {
      let routeName = `${file.split('.')[0]}Routes`;
      routes[routeName] = require(path.join(__dirname, file))(controllers, middlewares)
    });

  app.use(routes.authRoutes)
  app.use(routes.pictureRoutes)
  app.use(routes.profileRoutes)
  app.use(routes.defaultRoutes)
}
