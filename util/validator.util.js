const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const fileType = require('file-type')

module.exports = function () {
  return {
    validateRegisterInput(data) {
      if (!data.firstName) {
        return {
          isValid: false,
          msg: "First Name is required."
        }
      }
      if (!data.lastName) {
        return {
          isValid: false,
          msg: "Last Name is required."
        }
      }
      if (!data.username) {
        return {
          isValid: false,
          msg: "Username is required."
        }
      }
      if (data.username.length < 4) {
        return {
          isValid: false,
          msg: "Username too short."
        }
      }
      if (!data.email) {
        return {
          isValid: false,
          msg: "Email is required."
        }
      }
      if (!emailRegex.test(data.email)) {
        return {
          isValid: false,
          msg: "Email is invalid."
        }
      }
      if (!data.password) {
        return {
          isValid: false,
          msg: "Password is required."
        }
      }
      if (data.password !== data.passwordConfirm) {
        return {
          isValid: false,
          msg: "Passwords didn't match."
        }
      }
      if (data.password.length < 6) {
        return {
          isValid: false,
          msg: "Password too short."
        }
      }
      if (data.password.length > 50) {
        return {
          isValid: false,
          msg: "Password too long."
        }
      }
      return {
        isValid: true,
        msg: ""
      }
    },
    validateProfilePicture(profilePicture){
      const realFileType = fileType(profilePicture.buffer)

      if (realFileType.mime !== 'image/jpeg' && realFileType.mime !== 'image/jpg' && realFileType.mime !== 'image/png') {
        return {
          isValid: false,
          msg: 'Unaccepted file type.'
        }
      }

      return {
        isValid: true,
        msg: ""
      }
    },
    validator: require('validator'),
    getQueryLimits(queryLimits){
      let limits = {}
      const portionSize = 25
      const maxPortionSize = 50;
      if (queryLimits) {
        limits.to = Number(queryLimits.to)
        limits.from = Number(queryLimits.from)
        limits.size = limits.to - limits.from

        if (isNaN(limits.to) || isNaN(limits.from) || isNaN(limits.size)) {
          limits.from = 0
          limits.to = portionSize
          limits.size = limits.to - limits.from
        } else if (limits.size > maxPortionSize) {
          limits.to = limits.from + portionSize
          limits.size = limits.to - limits.from
        } else if (limits.size <= 0) {
          limits.from = 0
          limits.to = portionSize
          limits.size = limits.to - limits.from
        }
      } else {
        limits.from = 0
        limits.to = portionSize
        limits.size = limits.to - limits.from
      }
      return limits
    }
  }
}