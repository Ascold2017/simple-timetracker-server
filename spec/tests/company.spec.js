const chai = require('chai')
const chaiHttp  = require('chai-http')
const app = require('../../app').app

const should = chai.should()
chai.use(chaiHttp)

const db = require('../../database')

const jwt = require('jwt-simple')
const config = require('../../config.json')
const jasmine = require('../run')

describe('Test company', () => {

    let originalInterval

    beforeEach(done => {
        let prms = []
        prms.push(db.Company.remove({}))
        prms.push(db.User.remove({}))
        Promise.all(prms).then(() => done())
    })

    afterAll(done => {
        let prms = []
        prms.push(db.Company.remove({}))
        prms.push(db.User.remove({}))
        Promise.all(prms).then(() => done())
    })

    describe('Post /api/createCompany', () => {
        it('valid send', (done) => {
            chai
            .request(app)
            .post('/api/createCompany')
            .set('token', jwt.encode({ }, config.tokenKey))
            .send({
                name: 'Test name', // unique name
                username: 'Test username',
                email: 'test@mail.ru', // unique email
            })
            .end((err, res) => {
                expect(err).toBe(null)
                res.should.have.status(200)
                res.should.have.header('content-type', 'application/json; charset=utf-8')
                res.body.should.have.to.deep.equal({ status: 200, result: 'Company successfully created!' })
                done()
            })
        })

        it('invalid name and existed email', (done) => {
            new db.Company({
                name: 'Test name 2',
            })
            .save()
            .then(company => new db.User({
                username: 'Test username',
                email: 'test13@mail.ru',
                type: 2,
                password: '123',
                company_id: company._id,
                createdAt: new Date()
    
            })
            .save())
            .then(() => {
                chai
                .request(app)
                .post('/api/createCompany')
                .send({
                    name: 'Test name 2', // same previos request
                    username: 'Test username',
                    email: 'test13@mail.ru', // unique email
                })
                .end((err, res) => {
                    expect(err).toBe(null)
                    res.should.have.status(400)
                    res.should.have.header('content-type', 'application/json; charset=utf-8')
                    res.body.should.have.to.deep.equal({ status: 400, result: 'Почта уже занята' })
                    done()
                })
            })
            
        })

        it('invalid name and valid email', (done) => {
            new db.Company({
                name: 'Test name 2',
            })
            .save()
            .then(company => new db.User({
                username: 'Test username',
                email: 'test14@mail.ru',
                type: 2,
                password: '123',
                company_id: company._id,
                createdAt: new Date()
    
            })
            .save())
            .then(() => {
                chai
                .request(app)
                .post('/api/createCompany')
                .send({
                    name: 'Test name 2', // same previos request
                    username: 'Test username',
                    email: 'test15@mail.ru', // unique email
                })
                .end((err, res) => {
                    expect(err).toBe(null)
                    res.should.have.status(400)
                    res.should.have.header('content-type', 'application/json; charset=utf-8')
                    res.body.should.have.to.deep.equal({ status: 400, result: 'Компания с таким названием есть' })
                    done()
                })
            })
            
        })

        it('empty field', (done) => {
    
            chai
            .request(app)
            .post('/api/createCompany')
            .send({
                name: '',
                username: '',
                email: '',
            })
            .end((err, res) => {
                expect(err).toBe(null)
                res.should.have.status(400)
                res.should.have.header('content-type', 'application/json; charset=utf-8')
                res.body.should.have.to.deep.equal({ status: 400, result: 'Не все поля заполнены' })
                done()
            })
        })
    
    })

    describe('get /api/findCompanies', () => {
        it('correct response form', done => {
            new db.Company({ name: 'Test 1.4' })
            .save()
            .then(company => {
                chai
                .request(app)
                .get('/api/findCompanies')
                .set('token', jwt.encode({ }, config.tokenKey))
                .end((err, res) => {
                    expect(err).toBe(null)
                    res.should.have.status(200)
                    expect(res.body.status).toEqual(200)
                    expect(res.body.result.length).toEqual(1)
                    expect(res.body.result[0]._id).toBeDefined()
                    expect(res.body.result[0].name).toEqual('Test 1.4')
                    expect(res.body.result[0].__v).toEqual(0)
    
                    done()
                })
            })
            
        })
    })
})

