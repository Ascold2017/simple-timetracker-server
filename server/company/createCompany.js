const userEmitter = global.GLOBAL_EVENTS.appEmitter.get('user')
const db = require('../../database')
const Company = db.Company

module.exports = response => {
    console.log('Create Company')
    const data = response.data

    if (!data.name || !data.username || !data.email) {
        response.reply({ status: 400, result: 'Не все поля заполнены' })
    }

    userEmitter.emit('find', { email: data.email })
    .then(result => {
        if (result) {
            response.reply({ status: 400, result: 'Email already exist' })
        } else {

            new Company({
                name: data.name
            })
            .save()
            .then(createdCompany => {
                return userEmitter.emit('create', {
                    company_id: createdCompany._id,
                    username: data.username,
                    email: data.email,
                    password: '123',
                    type: 2 // admin
                })
            })
            .then(userResponse => {
                const hasError = userResponse.status === 200 ? false : true
                let result = userResponse.status === 200 ? 'Company successfully created!' : 'Error'

                if (userResponse.result.includes(data.email)) {
                    result = 'Email is already used'
                }

                response.reply({
                    status: hasError ? 400 : 200, 
                    result
                })
            })
            .catch(err => {
                let result = 'Ошибка!'
                if(err.errmsg.includes(data.name)) {
                    result = 'Компания с таким названием есть'
                } else if (err.errmsg.includes(data.email)) {
                    result = 'Почта уже занята'
                }
                response.reply({ status: 400, result })
            })
        }
    })
}
