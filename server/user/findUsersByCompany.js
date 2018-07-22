const User = require('../../database').User

module.exports = response => {
    
    User.find({ company_id: response.data.id })
    .then(users => response.reply({ status: 200, result: users }))
    .catch(e => response.catch({ status: 400, result: e.message })) 
}