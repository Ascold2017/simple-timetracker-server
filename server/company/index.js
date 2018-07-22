const appEmitter = global.GLOBAL_EVENTS.appEmitter
const companyEmitter = appEmitter.get('company')
const userEmitter = appEmitter.get('user')
const createCompany = require('./createCompany')
const findCompanies = require('./findCompanies')
const findCompany = require('./findCompany')

companyEmitter.on('create', createCompany)
companyEmitter.on('findAll', findCompanies)
companyEmitter.on('find', findCompany)
