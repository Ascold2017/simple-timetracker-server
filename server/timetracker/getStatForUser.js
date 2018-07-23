const appEmitter = global.GLOBAL_EVENTS.appEmitter
const userEmitter = appEmitter.get('user')
const companyEmitter = appEmitter.get('company')
const taskEmitter = appEmitter.get('task')
const db = require('../../database')
const Company = db.Company
const User = db.user
const Task = db.Task
const TimeTracker = db.Timetracker
const _ = require('lodash')

module.exports = response => {
    const data = response.data
    console.log(data)
    if (!data.userId) {
        return response.catch({ status: 400, result: 'Пользователь не указан' })
    }

    if (!data.from) {
        data.from = new Date(0)
    }

    if (!data.to) {
        data.to = Date.now()
    }

    

    TimeTracker
        .find({
            user_id: data.userId,
            date_end: { $exists: true, $lte: data.to },
            date_start: { $gte: data.from }
        })
        .sort({ date_start: 1 })
        .then(tracks => {
            let taskIds = []
            // collect unique task ids
            tracks.map(track => {
                if (!taskIds.includes(track.task_id)) {
                    taskIds.push(track.task_id)
                }
            })

            let promises = taskIds.map(taskId =>  taskEmitter.emit('find', { _id: taskId }))

            Promise.all(promises)
            .then(tasks => {
                return tasks.map(task => ({
                    name: task.name,
                    tracks: tracks.filter(track => {
                        console.log(typeof track.task_id, typeof task._id) // what === is false ????
                        return track.task_id == task._id
                    })
                    .map(track => ({
                        name: track.name,
                        start: track.date_start,
                        end: track.date_end
                    }))
                }))
            })
            .then(result => response.reply({ status: 200, result }))
      
        })
        .catch(e => response.catch({ status: 400, result: e.message }))
}
