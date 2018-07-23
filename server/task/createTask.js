const Company = require('../../database').Company
const Task = require('../../database').Task

module.exports = response => {

    const data = response.data
    if (!data.name || !data.company_id) {
        let result = ''
        !data.name ? result = 'Название таска обязательно' : null
        !data.company_id ? result = 'Не выбрана компания' : null
        return response.catch({ status: 400, result })
    }
    
    Company.findById(response.data.company_id)
    .then(() => {
        return Task.findOne({ company_id: response.data.company_id, name: response.data.name })
    })
    .then(existTask => {
        if (existTask) {
            throw { message : 'Такой таск уже есть в компании' }
        } else {
            const newTask = new Task({
                company_id: response.data.company_id,
                name: response.data.name,
            })
    
            return newTask.save()
        }
    })
    .then(() => response.reply({ status: 200, result: 'Таск успешно создан!' }))
    .catch(e => response.catch({ status: 400, result: e.message }))
}
