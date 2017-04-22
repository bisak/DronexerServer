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

  app.use('/api/auth', routes.authRoutes)
  app.use('/api/pictures', routes.postRoutes)
  app.use('/api/users', routes.profileRoutes)
  app.use(routes.defaultRoutes)
}
