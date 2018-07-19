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

    new Promise (resolve => {
        console.log('CreateCompany: ', ctx.request.body)
        company.send('create', ctx.response.body, response => resolve(response))
    })
    .then(response => {
        ctx.body = response
        next()
    })
   
})

module.exports = restRouter