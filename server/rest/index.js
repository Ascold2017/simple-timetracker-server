const router = require('express').Router()
const appEmitter = global.GLOBAL_EVENTS.appEmitter
const companyEmitter = appEmitter.get('company')
const userEmitter = appEmitter.get('user')
const taskEmitter = appEmitter.get('task')
const authEmitter = appEmitter.get('auth')
const timeTrackerEmitter = appEmitter.get('timetracker')
const jwt = require('jwt-simple')
const config = require('../../config')
const server = require('../../app').server
const io = require('socket.io')(3001, { path: '/timetracker' })

let clients = []

const isAuth = (req, res, next) => {

    if (!req.headers.token || req.headers.token.split('.').length !== 3) {
        res.status(401).json({ status: 401, result: 'Не авторизован!' })
    } else {
        const token = jwt.decode(req.headers.token, config.tokenKey)
        if (token) {
            next()
        } else {
            res.status(403).json({ status: 403, result: 'Не авторизован!' })
        }
    }
}

io.on('connection', function (socket) {
    console.log('connect')

    let id = clients.length

    clients[id] =  {}
   
    socket.on('startTask', msg =>  {

        console.log('start task')

        if (!msg.token) {
            socket.emit('error_message', { message: 'No token!' })
        } else {
            const token = jwt.decode(msg.token, config.tokenKey)

            clients[id].userToken = token.userId

            if (clients[id].activeTaskId) {
                timeTrackerEmitter.emit('stop', { taskId: clients[id].activeTaskId, userId: clients[id].userToken })
                    .then(response => socket.emit('task_stopped', response))
                    .catch(response => socket.emit('error_message', response))
            }

            timeTrackerEmitter.emit('start', { taskId: msg.taskId, userId: token.userId, company_id: token.company_id })
                .then(response => {
                    clients[id].activeTaskId = response.result.task._id
                    socket.emit('task_started', response)
                })
                .catch(response => socket.emit('error_message', response))
        }
        
    })

    socket.on('stopTask', msg =>  {

        console.log('stop task')
        if (!msg.token) {
            socket.emit('error_message', { message: 'No token!' })
        } else {
            timeTrackerEmitter.emit('stop', { taskId: clients[id].activeTaskId, userId: clients[id].userToken })
                .then(response => socket.emit('task_stopped', response))
                .catch(response => socket.emit('error_message', response))
        }
    })

    socket.on('disconnect', () => {
        console.log('disconnect')
        if (clients[id].activeTaskId && clients[id].userToken) {
            timeTrackerEmitter.emit('stop', {
                taskId: clients[id].activeTaskId,
                userId: clients[id].userToken
            })
        }
       
        delete clients[id]
    })
    
})


router.post('/createCompany', ( req, res ) => {
    companyEmitter.emit('create', req.body)
        .then(response => res.status(200).json(response))
        .catch(e => res.status(400).json(e))
})

router.get('/findCompanies', isAuth, (req, res) => {
    companyEmitter.emit('findAll', req.params.id)
        .then(response => res.status(200).json(response))
        .catch(e => res.status(400).json(e))
})

router.get('/findUsersByCompany', isAuth, ( req, res ) => {
    const token = jwt.decode(req.headers.token, config.tokenKey)

    userEmitter.emit('findById', { id: token.company_id })
        .then(response => res.status(200).json(response))
        .catch(e => res.status(400).json(e))
})

router.get('/findUsersByCompany/:id', isAuth, ( req, res ) => {
    userEmitter.emit('findById', req.params)
        .then(response => res.status(200).json(response))
        .catch(e => res.status(400).json(e))
})



router.post('/createTask', isAuth, (req, res) => {

    const token = jwt.decode(req.headers.token, config.tokenKey)

    console.log(token)

    taskEmitter.emit('create', { ...req.body, company_id: token.company_id })
        .then(response => res.status(200).json(response))
        .catch(e => res.status(400).json(e))
})

router.get('/findTasksByCompany', isAuth, (req, res) => {

    const token = jwt.decode(req.headers.token, config.tokenKey)

    taskEmitter.emit('findById',  { id: token.company_id })
        .then(response => res.status(200).json(response))
        .catch(e => res.status(400).json(e))
})

router.get('/findTasksByCompany/:id', isAuth, (req, res) => {
    taskEmitter.emit('findById', req.params)
        .then(response => res.status(200).json(response))
        .catch(e => res.status(400).json(e))
})

router.post('/login', (req, res) => {
    authEmitter.emit('login', req.body)
        .then(response => res.status(200).json(response))
        .catch(e => res.status(400).json(e))
})

router.post('/register', isAuth, (req, res) => {
    const token = jwt.decode(req.headers.token, config.tokenKey)

    authEmitter.emit('register', { ...req.body, company_id: token.company_id })
        .then(response => res.status(200).json(response))
        .catch(e => res.status(400).json(e))
})

router.get('/getTimetrackerStat', isAuth, (req, res) => {

    const token = jwt.decode(req.headers.token, config.tokenKey)

    timeTrackerEmitter.emit('getStatForUser', token)
        .then(response => res.status(200).json(response))
        .catch(e => res.status(400).json(e))
})

router.get('/getTimetrackerStat/:userId', isAuth, (req, res) => {
    timeTrackerEmitter.emit('getStatForUser', req.params)
        .then(response => res.status(200).json(response))
        .catch(e => res.status(400).json(e))
})



module.exports = router