const config = require('../../config')

const ms = require('@nauma/node-microservice')
const koa = require('koa')
const koaCors = require('@koa/cors')
const koaJson = require('koa-json')
const bodyParser = require('koa-bodyparser')
const koaStatic = require('koa-static')
const router = require('./routes')

const App = new koa()

App.use(koaStatic(__dirname + '/../../' + 'public'));
App.use(koaJson())
App.use(koaCors())
App.use(bodyParser())
App.use(router.routes())
App.use(router.allowedMethods());

App.use(function (ctx) {
	if (ctx.status === 404) {
		ctx.body = {
			status: false,
			error: true,
			message: 'method not found'
		}
	}
})

App.listen(config.microservices.rest.server.port)
