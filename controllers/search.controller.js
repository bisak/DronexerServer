const util = require('../util')

module.exports = (data) => {
  const postData = data.postData
  const userData = data.userData
  const searchData = data.searchData

  return {
    async searchForTag(req, res) {
      const { search } = req.query
      let result = await searchData.searchTags(search)
      return res.json({
        data: {
          count: result,
          tag: search
        },
        tags: true,
        success: true
      })
    },
    async searchForUser(req, res) {
      const { search } = req.query
      let result = await searchData.searchUserByUsername(search).select('username')
      return res.json({
        data: result,
        count: result.length,
        users: true,
        success: true
      })
    }
  }
}
