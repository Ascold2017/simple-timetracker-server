const appEmitter = global.GLOBAL_EVENTS.appEmitter
const userEmitter = appEmitter.get('user')

const validPassword = (incomingPassword, password) => {
    return incomingPassword === password
}

module.exports = response => {
    console.log('Login')
    let body = response.data
    userEmitter.emit('find', { email: body.email })
    .then(user => {
        if (user) {
            if (validPassword(user.password, body.password)) {
                response.reply({ status: 200, result: { token: 'fsdfsdfsdfsdf' } })
            } else {
                response.reply({ status: 400, result: 'Password incorrect' })
            }
        } else {
            response.reply({ status: 400, result: 'User not exist' })
        }
        
    })
}