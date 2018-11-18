const Task = require('../../database').Task

module.exports = response => {
    Task.find({ company_id: response.data.id })
    .then(tasks => response.reply({ status: 200, result: tasks }))
    .catch(e => response.replyErr({ status: 400, result: e.message }))
}