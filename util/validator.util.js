const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const fileType = require('file-type')
const validator = require('validator')

module.exports = {
  validateRegisterInput(data, isEditData) {
    if (!data.firstName) {
      return {
        isValid: false,
        msg: 'First Name is required.'
      }
    }
    if (data.firstName !== validator.escape(data.firstName)) {
      return {
        isValid: false,
        msg: 'First Name is invalid.'
      }
    }
    if (!data.lastName) {
      return {
        isValid: false,
        msg: 'Last Name is required.'
      }
    }
    if (data.lastName !== validator.escape(data.lastName)) {
      return {
        isValid: false,
        msg: 'Last Name is invalid.'
      }
    }
    if (!data.username) {
      return {
        isValid: false,
        msg: 'Username is required.'
      }
    }
    if (data.username !== validator.escape(data.username)) {
      return {
        isValid: false,
        msg: 'Username is invalid.'
      }
    }
    if (data.username.length < 4) {
      return {
        isValid: false,
        msg: 'Username too short.'
      }
    }
    if (!data.email) {
      return {
        isValid: false,
        msg: 'Email is required.'
      }
    }
    if (!validator.isEmail(data.email)) {
      return {
        isValid: false,
        msg: 'Email is invalid.'
      }
    }
    if (!isEditData) {
      if (!data.password) {
        return {
          isValid: false,
          msg: 'Password is required.'
        }
      }
    }
    if (data.password) {
      if (data.password.length < 6) {
        return {
          isValid: false,
          msg: 'Password too short.'
        }
      }
      if (data.password.length > 50) {
        return {
          isValid: false,
          msg: 'Password too long.'
        }
      }
    }
    return {
      isValid: true,
      msg: ''
    }
  },
  validateProfilePicture(profilePicture) {
    try{
      const realFileType = fileType(profilePicture.buffer) || {}
      if (realFileType.mime !== 'image/jpeg' && realFileType.mime !== 'image/jpg' && realFileType.mime !== 'image/png') {
        return {
          isValid: false,
          msg: 'Unaccepted file type.'
        }
      }
      return {
        isValid: true,
        msg: ''
      }
    }catch(error){
      return {
        isValid: false,
        msg: 'Unaccepted file type.'
      }
    }
  },
  validateIncomingPictureType(fileType) {
    if (fileType.mime !== 'image/jpeg' && fileType.mime !== 'image/jpg' && fileType.mime !== 'image/png') {
      return {
        isValid: false,
        msg: 'Unaccepted file type.'
      }
    }
    return {
      isValid: true,
      msg: ''
    }
  },
  validator: validator
}
