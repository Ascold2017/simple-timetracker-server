const Company = require('../../database').Company
const Task = require('../../database').Task

module.exports = response => {
    console.log('Create Task')
    Company.findById(response.data.company_id)
    .then(company => {

        return Task.findOne({ company_id: response.data.company_id, name: response.data.name })
        .then(exist => {
            if (exist) {
                throw { message: { status: 400, result: 'Task already exist' } }
            }

            const newTask = new Task({
                company_id: response.data.company_id,
                name: response.data.name,
            })
    
            return newTask.save()
                .then(() => response.reply({ status: 200, result: 'Task successfully created!' }))
        })
       
    })
    .catch(e => {
        console.log(e)
        response.reply({ status: 400, result: e.message })
    })
}
