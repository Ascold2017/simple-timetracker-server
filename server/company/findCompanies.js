const Company = require('../../database').Company
const mongoose = require('mongoose')
module.exports = response => {
    
    Company.find()
    .then(companies => response.reply({ status: 200, result: companies }))
    .catch(e => response.replyErr({ status: 400, result: e.message || e })) 
}
