module.exports = (models) => {
  const User = models.userModel;
  return {
    getProfilePictureByUsername(username){
      return User.findOne().where('username').equals(username).select('hasProfilePicture -_id')
    }
  }
}
