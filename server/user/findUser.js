const User = require('../../database').User

module.exports = response => {
    
    User.findOne(response.data)
    .then(user => {
        user ? response.reply(user) : response.catch({ status: 400, result: 'Такого пользователя нет!'})
    })
    .catch(e => response.catch({ status: 400, result: e }))
}