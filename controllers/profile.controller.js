module.exports = function (data) {
  const userData = data.userData;
  return {
    getProfilePicture(req, res){
      const username = req.params.username
      res.sendFile(`${username}.jpg`, { root: './storage/profile_pictures' }, (err) => {
        if (err) {
          res.status(404).json({
            success: false,
            msg: 'Error finding profile picture.'
          });
        }
      });
    },
    getProfileInfo(req, res){
      const username = req.params.username;
      userData.getUserByUsername(username, '-password -roles').then((retrievedUser) => {
        if (retrievedUser) {
          let objToReturn = retrievedUser.toObject()
          objToReturn.success = true
          return res.json(objToReturn)
        }

        return res.status(404).json({
          success: true,
          msg: 'User not found.'
        })

      }).catch((error) => {
        console.log(error)
        return res.status(500).json({
          success: false,
          msg: "Server error."
        })
      })
    }
  }
}
