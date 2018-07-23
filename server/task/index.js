const appEmitter = global.GLOBAL_EVENTS.appEmitter
const taskEmitter = appEmitter.get('task')
const createTask = require('./createTask')
const findTasksByCompany = require('./findTasksByCompany')
const findTask = require('./findTask')

taskEmitter.on('create', createTask)
taskEmitter.on('findById', findTasksByCompany)
taskEmitter.on('find', findTask)
