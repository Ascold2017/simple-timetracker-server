const Task = require('../../database').Task

module.exports = response => {
    
    Task.findOne(response.data)
    .then(task => {
        return task ? response.reply(task) : response.replyErr({ status: 400, result: 'Такого таска нет!'})
    })
    .catch(e => response.replyErr({ status: 400, result: e }))
}