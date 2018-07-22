const Company = require('../../database').Company

module.exports = response => {
    console.log('Find Company',response.data)
    Company.findOne(response.data)
    .then(user => {
        console.log(user)
        user ? response.reply(user) : response.catch({ status: 400, result: 'Такой компании нет!'})
    })
    .catch(e => response.catch({ status: 400, result: e.message }))
}