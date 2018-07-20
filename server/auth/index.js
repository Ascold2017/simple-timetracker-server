const appEmitter = global.GLOBAL_EVENTS.appEmitter
const authEmitter = appEmitter.get('auth')

const login = require('./login')
const register = require('./register')

authEmitter.on('register', register)
authEmitter.on('login', login)
