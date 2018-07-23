const router = require('express').Router()
const appEmitter = global.GLOBAL_EVENTS.appEmitter
const companyEmitter = appEmitter.get('company')
const userEmitter = appEmitter.get('user')
const taskEmitter = appEmitter.get('task')
const authEmitter = appEmitter.get('auth')
const timeTrackerEmitter = appEmitter.get('timetracker')
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });


const startTask = (ws, msg) => {
    ws.send('Start task: ' + msg.taskId + ' by user: ' + msg.token);
}

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    const msg = JSON.parse(message)
    console.log('received: ', msg);
    switch(msg.type) {
        case 'startTask': {
            timeTrackerEmitter.emit('start', msg)
                .then(response => ws.send(JSON.stringify(response)))
                .catch(response => ws.send(JSON.stringify(response)))
        }
        break;
        case 'stopTask': {
            timeTrackerEmitter.emit('stop', msg)
            .then(response => ws.send(JSON.stringify(response)))
            .catch(response => ws.send(JSON.stringify(response)))
        }
        break;
        default: ws.send('Unavailable send');
        break;
    }
  })

  ws.send('Connected');
});


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