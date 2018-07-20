const User = require('../../database').User

module.exports = response => {
    User.findOne(response.data)
    .then(user => response.reply(user))
    .catch(e => response.reply(null))
}