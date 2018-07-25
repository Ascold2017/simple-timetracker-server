const io = require('socket.io-client')
const db = require('../../database')
const chai = require('chai')
const jwt = require('jwt-simple')
const config = require('../../config.json')
const should = chai.should()

describe('Suite of unit tests', function() {

    var socket;

    let company
    let user
    let task
    let task2

    beforeAll(done => {
        // create company, user, task

        new db.Company({ name: 'Test 2.0' })
        .save()
        .then(createdCompany => {
            company = createdCompany
            return new db.User({
                username: 'Test user',
                email: 'test@gmail.com',
                password: '123',
                company_id: company._id,
                type: 3,
                createdAt: new Date()
            })
            .save()
        })
        .then(createdUser => {
            user = createdUser
            let promises = []
            promises.push(new db.Task({ name: 'testTask 1', company_id: company._id }).save())
            promises.push(new db.Task({ name: 'testTask 2', company_id: company._id }).save())
            return Promise.all(promises)
        })
        .then(createdTasks => {

            task1 = createdTasks[0]
            task2 = createdTasks[1]
            done()
        })
    })

    beforeEach(function(done) {
        // Setup
        socket = io.connect('http://localhost:3001', {
            path: '/timetracker',
            'reconnection delay' : 0,
            'reopen delay' : 0,
            'force new connection' : true
        });
        socket.on('connect', function() {
            console.log('worked...');
            db.Timetracker.remove({}).then(() => done())
        });
        socket.on('disconnect', function() {
            console.log('disconnected...');
        })
    });

    afterEach(function(done) {
        // Cleanup
        if(socket.connected) {
            console.log('disconnecting...');
            socket.disconnect();
        } else {
            // There will not be a connection unless you have done() in beforeEach, socket.on('connect'...)
            console.log('no connection to break...');
        }
        done();
    });

    afterAll(done => {
        let promises = []
        promises.push(db.Company.remove({}))
        promises.push(db.Task.remove({}))
        promises.push(db.Timetracker.remove({}))
        promises.push(db.User.remove({}))
        Promise.all(promises).then(() => done())
    })

    it ('connection is worked', done => {
        expect(socket.connected).toBe(true)
        done()
    })

    it ('send startTask - no token', done => {
        socket.emit('startTask', { }) // empty send

        socket.on('error_message', (msg) => {
            msg.should.to.deep.equal({ message: 'No token!' })
            done()
        })
    })

    it ('send startTask - correct form', done => {
        const token = jwt.encode({ userId: user._id, company_id: company._id }, config.tokenKey)
        socket.emit('startTask', { token, taskId: task1._id })

        socket.on('task_started', msg => {
            expect(msg.type).toBe('task-started')
            expect(msg.result.message).toBe('Task has been started')
            expect(msg.result.task._id).toBeDefined()
            expect(msg.result.task.name).toBe('testTask 1') // defined in beforeAll
            
            done()
        })
    })

    it('send start and stop task - correct form', done => {
        const token = jwt.encode({ userId: user._id, company_id: company._id }, config.tokenKey)
        new Promise((resolve) => {
            socket.emit('startTask', { token, taskId: task1._id })
            setTimeout(() => {
                socket.emit('stopTask', { token, taskId: task1._id })
                resolve()
            }, 3000)
        })
        .then(() => {
            socket.on('task_stopped', msg => {

                db.Timetracker.find({})
                .then(tracks => {
                    expect(tracks.length).toBe(1)
                    expect(tracks[0].date_start).toBeDefined()
                    expect(tracks[0].date_end).toBeDefined()
                    expect(tracks[0].date_start < tracks[0].date_end).toBeTruthy()
                    msg.should.to.deep.equal({ type: 'task_stopped', result: 'Таск успешно остановлен' })
                    done()
                })
                
            })
        })
 
    })

    it('send start and start other task - previos task must be stopped', done => {
        const token = jwt.encode({ userId: user._id, company_id: company._id }, config.tokenKey)
        new Promise((resolve) => {
            socket.emit('startTask', { token, taskId: task1._id })
            setTimeout(() => {
                socket.emit('startTask', { token, taskId: task2._id })
                resolve()
            }, 3000)
        })
        .then(() => {
            socket.on('task_started', msg => {

                db.Timetracker.find({})
                .then(tracks => {
                    expect(tracks.length).toBe(2)
                    expect(tracks[0].date_end).toBeDefined()
                    expect(tracks[1].date_end).toBeUndefined()
                    expect(msg.result.task.name).toBe('testTask 2')
                    done()
                })
                
            })
        })
 
    })

})
