module.exports = function (data) {
  const profileData = data.profileData;
  return {
    getProfilePicture(req, res){
      const username = req.params.username
      profileData.getProfilePictureByUsername(username).then((data) => {
        if (data.hasProfilePicture) {
          return res.sendFile(`${username}.jpg`, { root: './storage/profile_pictures' })
        } else {
          return res.status(404).json({
            success: false,
            msg: "No profile picture available."
          })
        }
      }).catch((error) => {
        res.status(500).json({
          success: false,
          msg: "Can't find profile picture or user doesn't exist.",
          err: error
        })
      })
    },
  }
}
