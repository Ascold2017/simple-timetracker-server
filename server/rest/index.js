const router = require('express').Router()
const appEmitter = global.GLOBAL_EVENTS.appEmitter
const companyEmitter = appEmitter.get('company')
const userEmitter = appEmitter.get('user')
const taskEmitter = appEmitter.get('task')
const authEmitter = appEmitter.get('auth')

router.post('/createCompany', ( req, res ) => {
    companyEmitter.emit('create', req.body)
        .then(response => res.status(200).json(response))
        .catch(e => res.status(400).json(e))
})

router.get('/findCompanies', (req, res) => {
    companyEmitter.emit('findAll', req.params.id)
        .then(response => res.status(200).json(response))
        .catch(e => res.status(400).json(e))
})

router.get('/findUsersByCompany/:id', ( req, res ) => {
    userEmitter.emit('findById', req.params)
        .then(response => res.status(200).json(response))
        .catch(e => res.status(400).json(e))
})

router.post('/createTask', (req, res) => {
    taskEmitter.emit('create', req.body)
        .then(response => res.status(200).json(response))
        .catch(e => res.status(400).json(e))
})

router.get('/findTasksByCompany/:id', (req, res) => {
    taskEmitter.emit('findById', req.params)
        .then(response => res.status(200).json(response))
        .catch(e => res.status(400).json(e))
})

router.post('/login', (req, res) => {
    authEmitter.emit('login', req.body)
        .then(response => res.status(200).json(response))
        .catch(e => res.status(400).json(e))
})

router.post('/register', (req, res) => {
    authEmitter.emit('register', req.body)
        .then(response => res.status(200).json(response))
        .catch(e => res.status(400).json(e))
})

module.exports = router