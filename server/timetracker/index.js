const appEmitter = global.GLOBAL_EVENTS.appEmitter
const timetrackerEmitter = appEmitter.get('timetracker')
const startTask = require('./startTask')
const stopTask = require('./stopTask')

timetrackerEmitter.on('start', startTask)
timetrackerEmitter.on('stop', stopTask)
