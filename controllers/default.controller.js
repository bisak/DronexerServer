module.exports = function () {
  return {
    invalidEndpoint (req, res) {
      return res.status(400).json({
        success: false,
        msg: 'Invalid API endpoint.'
      })
    },
    sendIndex (req, res) {
      return res.sendFile('index.html', { root: './public' })
    }
  }
}
