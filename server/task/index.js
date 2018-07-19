const config = require('../../config')
require('../../database')
const ms = require('@nauma/node-microservice')
const task = new ms.Microservice(config.microservices.task.name, config.microservices.task.connection)