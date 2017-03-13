const {app, appConfig} = require('./config/app')
require('./config/database')

//Start listening
app.listen(appConfig.port, function () {
	console.log(`Server listening on port: ${appConfig.port}`)
})
