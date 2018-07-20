const config = require('../../config')
const ms = require('@nauma/node-microservice')

const company = new ms.Microservice(config.microservices.company.name, config.microservices.company.connection)

const createCompany = require('./createCompany')

company.get(config.microservices.rest.name)
    .on('create', createCompany)