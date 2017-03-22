module.exports = function () {
  return {
    invalidEndpoint(req, res){
      res.status(404).json({
        success: false,
        msg: "Invalid API endpoint."
      })
    },
    sendIndex(req, res){
      res.sendFile('index.html', { root: "./public" })
    }
  }
}