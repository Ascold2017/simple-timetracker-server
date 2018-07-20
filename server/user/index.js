const appEmitter = global.GLOBAL_EVENTS.appEmitter
const userEmitter = appEmitter.get('user')
const createUser = require('./createUser')
const findUsersByCompany = require('./findUsersByCompany')
const findUser = require('./findUser')

userEmitter.on('create', createUser)
userEmitter.on('findById', findUsersByCompany)
userEmitter.on('find', findUser)
