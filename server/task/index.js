const config = require('../../config')
require('../../database')
const ms = require('@nauma/node-microservice')
const task = new ms.Microservice(config.microservices.task.name, config.microservices.task.connection)

const createTask = require('./createTask')

task.get(config.microservices.rest.name)
    .on('create', createTask)