const appEmitter = global.GLOBAL_EVENTS.appEmitter
const userEmitter = appEmitter.get('user')

const validPassword = (incomingPassword, password) => {
    return incomingPassword === password
}

module.exports = response => {
    console.log('Login')
    let body = response.data
    if (!body.email || !body.password) {
        return response.catch({ status: 400, result: 'Поля не заполнены!' })
    }
    userEmitter.emit('find', { email: body.email })
    .then(user => {
        if (user) {
            if (validPassword(user.password, body.password)) {
                response.reply({ status: 200, result: { token: user._id } })
            } else {
                response.catch({ status: 400, result: 'Password incorrect' })
            }
        } else {
            response.catch({ status: 400, result: 'User not exist' })
        }
    })
    .catch(e => response.catch(e))
}