const userEmitter = global.GLOBAL_EVENTS.appEmitter.get('user')
const db = require('../../database')
const Company = db.Company

module.exports = response => {
    console.log('Create Company')
    
    new Company({
        name: response.data.name
    })
    .save()
    .then(createdCompany => {
        return userEmitter.emit('create', {
            company_id: createdCompany._id,
            username: response.data.username,
            email: response.data.email,
            password: '123',
            type: 2 // admin
        })
    })
    .then(e => {
        const hasError = e.status === 200 ? false : true
        response.reply({
            status: hasError ? 400 : 200, 
            result: hasError === 200 ? 'Company successfully created!' : e.message
        })
    })
    .catch(e => response.reply({ status: 400, result: e.message }))
}