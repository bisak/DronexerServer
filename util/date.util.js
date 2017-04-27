const moment = require('moment')

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

module.exports = function () {
  return {
    getCurrentDateString(){
      let t = new Date();
      return `${t.getDate()} ${monthNames[t.getMonth()]}, ${t.getFullYear()}` //24 March, 2017 <- format
    },
    moment
  }
}

/*TODO => moment.js (x minutes/hours ago)*/