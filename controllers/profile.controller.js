module.exports = function (data) {
  const userData = data.userData
  const postData = data.postData
  return {
    getProfilePicture (req, res) {
      const username = req.params.username
      res.sendFile(`${username}.jpg`, {root: './storage/profile_pictures'}, (error1) => {
        if (error1) {
          res.sendFile(`default_profile_picture.jpg`, {root: './logos'}, (error2) => {
            if (error2) {
              res.status(404).json({
                success: false,
                msg: 'Error finding profile picture.',
                err: error2
              })
            }
          })
        }
      })
    },
    getProfileInfo (req, res) {
      /*Change this to work with ids*/
      const username = req.params.username
      const userId = '' /*TODO fix that.*/
      let profileData = userData.getUserByUsername(username, '-password -roles')
      let userPicturesCount = postData.getPicturesCountByUsername(userId)
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
        console.error(error)
        return res.status(500).json({
          success: false,
          msg: 'Server error.'
        })
      })
    }
  }
}
