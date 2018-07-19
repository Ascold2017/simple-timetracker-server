const config = require('../../config')
require('../../database')
const ms = require('@nauma/node-microservice')
const task = new ms.Microservice(config.microservices.task.name, config.microservices.task.connection)

const Company = require('../../database').Company
const Task = require('../../database').Task

task.get(config.microservices.rest.name)
    .on('create', response => {

        Company.findById(response.result.company_id)
            .then(company => {
                if (!company) throw new Error('Company not exist!')

                const newTask = new Task({
                    company_id: response.result.company_id,
                    username: response.result.name,
                })
        
                newTask.save()
                    .then(() => response.reply({ message: 'Task successfully created!' }))
                    .catch(() => { throw new Error(e.message) })
            })
            .catch(e => response.reply({ message: e.message }))
    })