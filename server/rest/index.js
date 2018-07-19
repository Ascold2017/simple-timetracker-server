const router = require('express').Router()
const companyEmitter = global.GLOBAL_EVENTS.companyEmitter
const authEmitter = global.GLOBAL_EVENTS.authEmitter
const userEmitter = global.GLOBAL_EVENTS.userEmitter
const taskEmitter = global.GLOBAL_EVENTS.taskEmitter
const timetrackerEmitter = global.GLOBAL_EVENTS.timetrackerEmitter

router.post('/createCompany', ( req, res ) => { companyEmitter.emit('create', { req, res }) })

router.post('/createUser', ( req, res ) => { authEmitter.emit('register', { req, res }) })

router.post('/createTask', (req, res) => { taskEmitter.emit('create', { req, res })})

module.exports = router