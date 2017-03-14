const fs = require('fs')
const path = require('path')

module.exports = function (data) {
	let controllers = {}

	fs.readdirSync(__dirname)
		.filter(x => x.includes(".controller"))
		.forEach(file => {
			let controllerName = `${file.split('.')[0]}Controller`;
			controllers[controllerName] = require(path.join(__dirname, file))(data)
		});

	return controllers

}