const appEmitter = global.GLOBAL_EVENTS.appEmitter
const userEmitter = appEmitter.get('user')
const companyEmitter = appEmitter.get('company')
const taskEmitter = appEmitter.get('task')
const db = require('../../database')
const Company = db.Company
const User = db.User
const Task = db.Task
const TimeTracker = db.Timetracker

module.exports = response => {
    const data = response.data

    if (!data.userId) {
        return response.catch({ status: 400, result: 'Пользователь не указан' })
    }

    if (!data.to) {
        
        data.to = new Date()
    }

    if (!data.from) {
        userEmitter.emit('find', { _id: data.userId })
        .then(user => {
            data.from = user.createdAt
            exec()
        })
    } else {
        exec()
    }


    // main method
    const exec = () => {

        TimeTracker
        .find({
            user_id: data.userId,
            date_start: { $lt: data.to },
            date_end: { $lt: data.to, $gte: data.from}
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

            let promises = taskIds.map(taskId => taskEmitter.emit('find', { _id: taskId }))

            Promise.all(promises)
            .then(tasks => {
                return tasks.map(task => {

                    let taskTracks = tracks
                        .filter(track => track.task_id == task._id)
                        .map(track => ({
                            name: track.name,
                            start: track.date_start,
                            end: track.date_end
                        }))
                    
                    let total = taskTracks.reduce((prev, next) => {
                        return prev + ((+new Date(next.end)) - (+new Date(next.start)))
                    }, 0)
            
                    return {
                        name: task.name,
                        total: Math.round(total / 1000),
                        tracks: taskTracks
                    }
                })
            })
            .then(result => response.reply({ status: 200, result }))
      
        })
        .catch(e => response.catch({ status: 400, result: e.message }))
    }
}
