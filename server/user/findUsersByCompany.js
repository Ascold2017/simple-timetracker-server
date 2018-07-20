const User = require('../../database').User
const mongoose = require('mongoose')
module.exports = response => {
    console.log('Find users by company')
    
    User.find({ company_id: response.data.id })
    .then(users => response.reply({ status: 200, result: users }))
    .catch(e => response.reply({ status: 400, result: e.message }))
    
}