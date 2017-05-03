
module.exports = function () {
  return {
    assignUsernames(arrayOfObjects, arrayOfUsers){
      arrayOfObjects.forEach((obj) => {
        arrayOfUsers.forEach((user) => {
          if (obj.userId === user._id) {
            obj.username = user.username
          }
        })
      })
      return arrayOfObjects
    },
    filterTags(tags){
      return tags.filter((x) => x !== '' && x.startsWith('#') && x.length > 4).map((x) => x.toLowerCase())
    }
  }
}