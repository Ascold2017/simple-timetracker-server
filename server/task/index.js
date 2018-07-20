const appEmitter = global.GLOBAL_EVENTS.appEmitter
const taskEmitter = appEmitter.get('task')
const createTask = require('./createTask')
const findTasksByCompany = require('./findTasksByCompany')

taskEmitter.on('create', createTask)
taskEmitter.on('findById', findTasksByCompany)
