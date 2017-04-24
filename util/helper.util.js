
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
    }
  }
}