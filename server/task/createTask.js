const Company = require('../../database').Company
const Task = require('../../database').Task

module.exports = response => {
    Company.findById(response.result.company_id)
    .then(company => {
        if (!company) throw new Error('Company not exist!')

        const newTask = new Task({
            company_id: response.result.company_id,
            name: response.result.name,
        })

        return newTask.save()
            .then(() => response.reply({ message: 'Task successfully created!' }))
            .catch(e => { throw new Error(e.message) })
    })
    .catch(e => response.reply({ message: e.message }))
}