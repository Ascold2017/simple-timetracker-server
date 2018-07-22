const Company = require('../../database').Company
const mongoose = require('mongoose')
module.exports = response => {
    console.log('Find companies')
    
    Company.find()
    .then(companies => response.reply({ status: 200, result: companies }))
    .catch(e => response.catch({ status: 400, result: e.message || e })) 
}
