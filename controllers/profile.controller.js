module.exports = function (data) {
  const userData = data.userData
  const pictureData = data.pictureData
  return {
    getProfilePicture (req, res) {
      const username = req.params.username
      res.sendFile(`${username}.jpg`, {root: './storage/profile_pictures'}, (err) => {
        if (err) {
          res.status(404).json({
            success: false,
            msg: 'Error finding profile picture.'
          })
        }
      })
    },
    getProfileInfo (req, res) {
      const username = req.params.username
      let profileData = userData.getUserByUsername(username, '-password -roles -__v')
      let userPicturesCount = pictureData.getPicturesCountByUsername(username)
      Promise.all([profileData, userPicturesCount]).then(retrievedData => {
        let retrievedUser = retrievedData[0]
        let retrievedPicCount = retrievedData[1]
        if (retrievedUser) {
          let objToReturn = retrievedUser.toObject()
          /* TODO fix this will eat memory. (use .count in mongoose) and exclude the following/followers fields */
          objToReturn.followersCount = objToReturn.followers.length
          objToReturn.followingCount = objToReturn.following.length
          objToReturn.picturesCount = retrievedPicCount
          delete objToReturn.followers
          delete objToReturn.following
          return res.json({
            data: objToReturn,
            success: true
          })
        }
        return res.status(404).json({
          success: false,
          msg: 'User not found.'
        })
      }).catch((error) => {
        console.log(error)
        return res.status(500).json({
          success: false,
          msg: 'Server error.'
        })
      })
    }
  }
}
