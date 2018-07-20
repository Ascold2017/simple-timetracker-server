const Company = require('../../database').Company
const mongoose = require('mongoose')
module.exports = response => {
    console.log('Find companies')
    
    Company.find()
    .then(companies => response.reply({ status: 200, result: companies }))
    .then(e => response.reply({ status: 400, result: e && e.message || e })) 
}
