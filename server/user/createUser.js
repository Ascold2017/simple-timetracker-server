const appEmitter = global.GLOBAL_EVENTS.appEmitter
const userEmitter = appEmitter.get('user')
const companyEmitter = appEmitter.get('company')
const User = require('../../database').User
module.exports = response => {

    userEmitter.emit('find', { email: response.data.email })
    .then(() => response.replyErr({ result: 'Такой пользователь уже есть', status: 400 }))
    .catch(() => {
        companyEmitter.emit('find', { _id: response.data.company_id })
        .then(() => new User({ ...response.data, createdAt: new Date() }).save())
        .then(() => response.reply({ result: 'Пользователь успешно создан', status: 200 }))
        .catch(e => {
            response.replyErr({ result: e.message || e.result || e, status: 400 })
        })
    })
}