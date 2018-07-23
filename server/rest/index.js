const router = require('express').Router()
const appEmitter = global.GLOBAL_EVENTS.appEmitter
const companyEmitter = appEmitter.get('company')
const userEmitter = appEmitter.get('user')
const taskEmitter = appEmitter.get('task')
const authEmitter = appEmitter.get('auth')
const timeTrackerEmitter = appEmitter.get('timetracker')

const io = require('socket.io')(3001, { path: '/timetracker' })

let clients = []

io.on('connection', function (socket) {

    let id = clients.length

    clients[id] = socket.id
    
    socket.on('startTask', msg =>  {

        clients[id].userToken = msg.token
        timeTrackerEmitter.emit('start', msg)
            .then(response => {
                clients[id].activeTaskId = response.result.task._id
                socket.emit('task-started', response)
            })
            .catch(response => socket.emit('error', response))
    })

    socket.on('stopTask', msg =>  {

        timeTrackerEmitter.emit('stop', msg)
            .then(response => socket.emit('task-stopped', response))
            .catch(response => socket.emit('error', response))
    })

    socket.on('disconnect', () => {
   
        timeTrackerEmitter.emit('stop', {
            taskId: clients[id].activeTaskId,
            token: clients[id].userToken
        })
        delete clients[id]
    })

})


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

router.get('/getTimetrackerStat/:userId', (req, res) => {
    timeTrackerEmitter.emit('getStatForUser', req.params)
        .then(response => res.status(200).json(response))
        .catch(e => res.status(400).json(e))
})

module.exports = router