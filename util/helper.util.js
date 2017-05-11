module.exports = function () {
  return {
    assignUsernames(arrayOfPosts, arrayOfUsers){
      arrayOfPosts.forEach((post) => {
        post.username = '[deleted]'
        arrayOfUsers.forEach((user) => {
          if (post.userId === user._id) {
            post.username = user.username
          }
        })
      })
      return arrayOfPosts
    },
    filterTags(tags){
      if (tags && tags.length <= 15) {
        return tags.filter((x) => x !== '' && x.startsWith('#') && x.length > 3 && x.length <= 20).map((x) => x.toLowerCase()).map(((x) => x.substr(1)))
      } else {
        return null
      }
    }
  }
}