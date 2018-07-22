const userEmitter = global.GLOBAL_EVENTS.appEmitter.get('user')
const db = require('../../database')
const Company = db.Company

module.exports = response => {
    console.log('Create Company')
    const data = response.data

    if (!data.name || !data.username || !data.email) {
        return response.catch({ status: 400, result: 'Не все поля заполнены' })
    }

    userEmitter.emit('find', { email: data.email })
    .then(() => response.catch({ status: 400, result: 'Почта уже занята' }))
    .catch(() => {
            // if admin email is free - we can create company
            new Company({ name: data.name })
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
            .then(() => {
                response.reply({ status: 200, result: 'Company successfully created!' })
            })
            .catch(e => {
                let result = 'Ошибка!'
                if (e.errmsg) {
                    if (e.errmsg.includes(data.name)) {
                        result = 'Компания с таким названием есть'
                    }
                }
                response.catch({ status: 400, result })
            })
        })
}
