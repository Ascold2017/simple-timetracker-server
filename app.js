const config = require('./config')
const ee = require('@nauma/eventemitter')
// global events
const appEmitter = new ee.GroupEventEmitters()

appEmitter.add( new ee.EventEmitter('auth'))
appEmitter.add(new ee.EventEmitter('company'))
appEmitter.add(new ee.EventEmitter('user'))
appEmitter.add(new ee.EventEmitter('task'))
appEmitter.add(new ee.EventEmitter('timetracker'))

global.GLOBAL_EVENTS = { appEmitter }

// base includes
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

const server = require('http').Server(app)

const api = require('./server/rest')

// base settings
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())
app.use(express.static(__dirname + '/public'))

app.use('/api', api)

// services
require('./database')

require('./server/auth')
require('./server/company')
require('./server/user')
require('./server/task')
require('./server/timetracker')

app.use('/', (req, res) => {
    res.sendFile(__dirname + '/public/' + 'index.html')
})

// start
server.listen(config.port)

module.exports = app
