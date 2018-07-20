const appEmitter = global.GLOBAL_EVENTS.appEmitter
const userEmitter = appEmitter.get('user')

module.exports = response => {
    console.log('Register', response.data)
    let body = response.data
    userEmitter.emit('create', body, res => {
        response.reply({ message: res })
    })
}