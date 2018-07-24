const appEmitter = global.GLOBAL_EVENTS.appEmitter
const userEmitter = appEmitter.get('user')
const companyEmitter = appEmitter.get('company')
const taskEmitter = appEmitter.get('task')
const db = require('../../database')
const Company = db.Company
const User = db.user
const Task = db.Task
const TimeTracker = db.Timetracker

module.exports = response => {

    const data = response.data

    if (!data.userId) {
        return response.catch({ status: 400, result: 'Пользователь не указан' })
    }
    if (!data.taskId) {
        return response.catch({ status: 400, result: 'Таск не указан' })
    }

    userEmitter.emit('find', { _id: data.userId })
    .then(() => {
        return TimeTracker.findByIdAndUpdate(data.taskId, {
            date_end: Date.now()
        })
    })
    .then(() => response.reply({ type: 'task-stopped', result: 'Таск успешно остановлен' }))
    .catch(e => response.catch(e))
}