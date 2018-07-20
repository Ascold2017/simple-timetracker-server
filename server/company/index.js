const appEmitter = global.GLOBAL_EVENTS.appEmitter
const companyEmitter = appEmitter.get('company')
const userEmitter = appEmitter.get('user')
const createCompany = require('./createCompany')
const findCompanies = require('./findCompanies')

companyEmitter.on('create', createCompany)
companyEmitter.on('find', findCompanies)
