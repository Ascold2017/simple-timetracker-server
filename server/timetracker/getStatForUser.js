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

    if (!data.userId) {
        return response.catch({ status: 400, result: 'Пользователь не указан' })
    }

    TimeTracker
        .find({ user_id: data.userId })
        .sort({ date_start: 1 })
        .then(tracks => {

            // TODO
            // 1. собрать task_id всех треков
            // 2. запросить таски по айдишникам
            // 3. сгруппировать таски к такому виду:
            /* [
                    {
                        name: 'Some task',
                        tracks: [
                            {
                                date_start: ....,
                                date_end: ....
                            }
                        ]
                    }

                ]
            */

            
            response.reply(tracks)
        })
        .catch(e => response.catch({ status: 400, result: e.message }))
}
