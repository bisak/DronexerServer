const utils = require('util')

const dronesArray = [
  'DJI Phantom 3 Std',
  'DJI Phantom 3 4K',
  'DJI Phantom 3 SE',
  'DJI Phantom 3 Adv',
  'DJI Phantom 3 Pro',
  'DJI Phantom 4',
  'DJI Phantom 4 Adv',
  'DJI Phantom 4 Pro',
  'DJI Mavic Pro',
  'DJI Spark',
  'DJI Inspire 1',
  'DJI Inspire 1 Pro',
  'DJI Inspire 2',
  'Parrot',
  'Yuneec',
  '3DR',
  'Racing/FPV',
  'Other/Unspecified'
]

function isLikedBy(post, user) {
  if (user) {
    return post.likes.some(likerId => likerId === user._id)
  }
  return false
}


module.exports = {
  assignUsernames(arrayOfPosts, arrayOfUsers) {
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
  filterTags(tags) {
    if (tags && tags.length <= 15) {
      return tags
        .filter((tag) => tag !== '' && tag.startsWith('#') && tag.length > 3 && tag.length <= 20)
        .map((tag) => tag.toLowerCase())
        .map((tag) => tag.substr(1))
    } else {
      return []
    }
  },
  getDronesArray() {
    return dronesArray
  },
  assignDroneNames(inputData) {
    let outputData = []
    if (Number.isInteger(Number(inputData))) {
      return dronesArray[inputData]
    } else if (Array.isArray(inputData)) {
      inputData.forEach((el, i) => {
        outputData.push(dronesArray[inputData[i]])
      })
    } else {
      return ''
    }
    return outputData
  },
  isLikedBy: isLikedBy,
  areLikedBy(posts, user) {
    return posts.map(post => {
      post.isLikedByCurrentUser = isLikedBy(post, user)
      return post
    })
  }
}
