const User = require('../../database').User
const mongoose = require('mongoose')
module.exports = response => {
    console.log('Create User')
    const newUser = new User(response.data)
    
    User.findById(response.data.company_id)
    .then(() => {
        newUser
        .save((e, user) => {
            if (e) {
                response.reply({ result: e.message, status: 400 })
                return null
            }
            
            response.reply({ result: 'User successfully created', status: 200 })
        })
    })
    .catch(e => response.reply({ result: e.message, status: 400 }))
   
}