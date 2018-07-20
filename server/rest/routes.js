const config = require('../../config')
const koaRouter = require('koa-router')
const restRouter = new koaRouter();
const ms = require('@nauma/node-microservice')
// connect to api server
const rest = new ms.Clientservice(config.microservices.rest.name, config.microservices.rest.connections)
const auth = rest.get('auth')
const company = rest.get('company')
const user = rest.get('user')
const task = rest.get('task')
const timetracker = rest.get('timetracker')

restRouter.post('/api/createCompany', (ctx, next) => {
    return new Promise (resolve => {
        company.send('create', ctx.request.body, response => resolve(response))
    })
    .then(response => {
        ctx.body = response
        next()
    })
})

restRouter.post('/api/createUser', (ctx, next) => {
    return new Promise (resolve => {
        user.send('create', ctx.request.body, response => resolve(response))
    })
    .then(response => {
        ctx.body = response
        next()
    })
})

restRouter.get('/api/getUsersByCompany/:id', (ctx, next) => {
    return new Promise (resolve => {
        user.send('findByCompanyId', ctx.params, response => resolve(response))
    })
    .then(response => {
        ctx.body = response
        next()
    })
})

restRouter.post('/api/createTask', (ctx, next) => {
    return new Promise (resolve => {
        task.send('create', ctx.request.body, response => resolve(response))
    })
    .then(response => {
        ctx.body = response
        next()
    })
})

module.exports = restRouter
