const appEmitter = global.GLOBAL_EVENTS.appEmitter
const timetrackerEmitter = appEmitter.get('timetracker')
const startTask = require('./startTask')
const stopTask = require('./stopTask')
const getStatForUser = require('./getStatForUser')

timetrackerEmitter.on('start', startTask)
timetrackerEmitter.on('stop', stopTask)
timetrackerEmitter.on('getStatForUser', getStatForUser)
