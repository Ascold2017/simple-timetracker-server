const appEmitter = global.GLOBAL_EVENTS.appEmitter
const userEmitter = appEmitter.get('user')

module.exports = response => {

    let data = response.data
    let fillField = data.username && data.email
    if (!fillField) {
        return response.replyErr({ status: 400, result: 'Не все поля заполнены!' })
    }
    if (!data.company_id) {
        return response.replyErr({ status: 400, result: 'Не выбрана компания!' })
    }
    if (data.type < 1 || data.type > 3) {
        return response.replyErr({ status: 400, result: 'Не верно выбрана роль пользователя' })
    }

    userEmitter.emit('create', data)
    .then(res => {
        response.reply({ result: res.result, status: 200 })
    })
    .catch(e => response.replyErr(e))
}