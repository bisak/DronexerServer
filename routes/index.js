module.exports = function (app, data) {
	require('./auth.routes')(app, data)
	require('./default.routes')(app, data)
}