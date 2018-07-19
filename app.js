const EventEmitter = require('events').EventEmitter
// global events
global.GLOBAL_EVENTS = {}
global.GLOBAL_EVENTS.authEmitter = new EventEmitter()
global.GLOBAL_EVENTS.companyEmitter = new EventEmitter()
global.GLOBAL_EVENTS.userEmitter = new EventEmitter()
global.GLOBAL_EVENTS.taskEmitter = new EventEmitter()
global.GLOBAL_EVENTS.timetrackerEmitter = new EventEmitter()

// base includes
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

const server = require('http').Server(app);
const io = require('socket.io')(server, { path: '/websocket-api' })
const api = require('./server/rest')

// base settings
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())
app.use('/static', express.static(__dirname + '/public'))

app.use('/api', api)
// io.on('connection', )

// services
require('./database')
require('./server/auth')
require('./server/company')
require('./server/user')
require('./server/task')
require('./server/timetracker')
// start
server.listen(2018)


