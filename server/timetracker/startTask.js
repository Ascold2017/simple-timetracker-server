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
        return response.replyErr({ status: 400, result: 'Пользователь не указан' })
    }
    if (!data.taskId) {
        return response.replyErr({ status: 400, result: 'Таск не указан' })
    }

    let taskName = ''

    userEmitter.emit('find', { _id: data.userId })
    .then(user => companyEmitter.emit('find', { _id: user.company_id }))
    .then(() => taskEmitter.emit('find', { _id: data.taskId }))
    .then(task => {
        taskName = task.name
        return new TimeTracker({
            task_id: data.taskId,
            user_id: data.userId,
            date_start: Date.now()
        })
        .save()
    })
    .then(track =>  response.reply({ type: 'task-started', result: { message: 'Task has been started', task: { _id: track._id, name: taskName } } }))
    .catch(e => response.replyErr({ type: 'error-start-task', result: e.result }))
}
