
const User = require('../../database').User

module.exports = response => {
    User.findOne({ email: response.result.email })
        .then(user => {
            if (user.password === response.result.password) {
                response.reply({ message: 'login success' })
            } else {
                response.reply({ message: 'password incorrect' })
            }
        })
        .catch(e => response.reply({ message: 'email incorrect' }))
    
}