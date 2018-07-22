const Company = require('../../database').Company

module.exports = response => {

    Company.findOne(response.data)
    .then(user => {
        user ? response.reply(user) : response.catch({ status: 400, result: 'Такой компании нет!'})
    })
    .catch(e => response.catch({ status: 400, result: e.message }))
}