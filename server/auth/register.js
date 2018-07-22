const appEmitter = global.GLOBAL_EVENTS.appEmitter
const userEmitter = appEmitter.get('user')

module.exports = response => {
    console.log('Register')
    let data = response.data
    let fillField = data.username && data.email && data.password && data.type
    if (!fillField) {
        return response.catch({ status: 400, result: 'Не все поля заполнены!' })
    }
    if (!data.company_id) {
        return response.catch({ status: 400, result: 'Не выбрана компания!' })
    }

    userEmitter.emit('create', data)
    .then(res => {
        response.reply({ message: res })
    })
    .catch(e => response.catch(e))
}