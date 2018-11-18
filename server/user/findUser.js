const User = require('../../database').User

module.exports = response => {
    
    User.findOne(response.data)
    .then(user => {
        user ? response.reply(user) : response.replyErr({ status: 400, result: 'Такого пользователя нет!'})
    })
    .catch(e => response.replyErr({ status: 400, result: e }))
}