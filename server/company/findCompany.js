const Company = require('../../database').Company

module.exports = response => {

    Company.findOne(response.data)
    .then(user => {
        user ? response.reply(user) : response.replyErr({ status: 400, result: 'Такой компании нет!'})
    })
    .catch(e => response.replyErr({ status: 400, result: e.message }))
}