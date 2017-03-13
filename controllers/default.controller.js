module.exports = function (data) {
	return {
		invalidEndpoint(req, res){
			res.json({
				success: false,
				msg: "Invalid API endpoint."
			})
		},
		sendIndex(req, res){
			res.sendFile('index.html', { root: "./public" })
		}
	}
}