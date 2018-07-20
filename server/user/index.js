const config = require('../../config')
const ms = require('@nauma/node-microservice')
const user = new ms.Microservice(config.microservices.user.name, config.microservices.user.connection)
const createUser = require('./createUser')
const findByCompanyId = require('./findByCompanyId')

user.get(config.microservices.rest.name)
    .on('create', createUser)
    .on('findByCompanyId', findByCompanyId)

user.get('company')
    .on('create', createUser)
