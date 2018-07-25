const chai = require('chai')
const chaiHttp  = require('chai-http')
const app = require('../../app').app

const should = chai.should()
chai.use(chaiHttp)

const db = require('../../database')

const jwt = require('jwt-simple')
const config = require('../../config.json')

describe('Test auth', () => {

    beforeEach(done => {
        let prms = []
        prms.push(db.Company.remove({}))
        prms.push(db.User.remove({}))
        Promise.all(prms).then(() => done())
    })

    describe('Test POST /api/register', () => {
        it('valid form', done => {
            let id = null
            new db.Company({ name: 'Test 1.6' })
            .save()
            .then(company => {
                id = company._id

                chai
                .request(app)
                .post('/api/register')
                .set('token', jwt.encode({ company_id: id }, config.tokenKey))
                .send({
                    company_id: id,
                    username: 'Test username',
                    email: 'test@mail.ru', // unique email
                    password: '123',
                    type: 3
                })
                .end((err, res) => {
                    expect(err).toBe(null)
                    res.should.have.status(200)
                    res.should.have.header('content-type', 'application/json; charset=utf-8')
                    res.body.should.have.to.deep.equal({ result: 'Пользователь успешно создан', status: 200 })
                    done()
                })
            })
        })

        it('company not exist', done => {
            let id = null
            new db.Company({ name: 'Test 1.7' })
            .save()
            .then(company => {
                id = company._id
                return db.Company.findByIdAndRemove(id)
            })
            .then(() => {
                chai
                .request(app)
                .post('/api/register')
                .set('token', jwt.encode({ company_id: id }, config.tokenKey))
                .send({
                    company_id: id,
                    username: 'Test username',
                    email: 'test@mail.ru', // unique email
                    password: '123',
                    type: 3
                })
                .end((err, res) => {
                    expect(err).toBe(null)
                    res.should.have.status(400)
                    res.should.have.header('content-type', 'application/json; charset=utf-8')
                    res.body.should.have.to.deep.equal({ result: 'Такой компании нет!', status: 400 })
                    done()
                })
            })
        })

        it('company not choosed', done => {
            
            chai
            .request(app)
            .post('/api/register')
            .set('token', jwt.encode({ company_id: null }, config.tokenKey))
            .send({
                company_id: null,
                username: 'Test username',
                email: 'test@mail.ru', // unique email
                password: '123',
                type: 3
            })
            .end((err, res) => {
                expect(err).toBe(null)
                res.should.have.status(400)
                res.should.have.header('content-type', 'application/json; charset=utf-8')
                res.body.should.have.to.deep.equal({ result: 'Не выбрана компания!', status: 400 })
                done()
            })
            
        })

        it('empty fields', done => {
            
            chai
            .request(app)
            .post('/api/register')
            .set('token', jwt.encode({ company_id: null }, config.tokenKey))
            .send({
                company_id: null,
                username: null,
                email: null, // unique email
                password: null,
                type: null
            })
            .end((err, res) => {
                expect(err).toBe(null)
                res.should.have.status(400)
                res.should.have.header('content-type', 'application/json; charset=utf-8')
                res.body.should.have.to.deep.equal({ result: 'Не все поля заполнены!', status: 400 })
                done()
            })
            
        })

        it('email already used', done => {
            let id = null
            new db.Company({ name: 'Test 1.6' })
            .save()
            .then(company => {
                id = company._id
                return new db.User({
                    company_id: id,
                    username: 'Test username',
                    email: 'test@mail.ru', // unique email
                    password: '123',
                    type: 3,
                    createdAt: new Date()
                })
                .save()
            })
            .then(() => {
                chai
                .request(app)
                .post('/api/register')
                .set('token', jwt.encode({ company_id: id }, config.tokenKey))
                .send({
                    company_id: id,
                    username: 'Test username',
                    email: 'test@mail.ru',
                    password: '123',
                    type: 2
                })
                .end((err, res) => {
                    expect(err).toBe(null)
                    res.should.have.status(400)
                    res.should.have.header('content-type', 'application/json; charset=utf-8')
                    res.body.should.have.to.deep.equal({ result: 'Такой пользователь уже есть', status: 400 })
                    done()
                })
            })
        })

        it('incorrect user type', done => {
            let id = null
            new db.Company({ name: 'Test 1.6' })
            .save()
            .then(company => {
                id = company._id

                chai
                .request(app)
                .post('/api/register')
                .set('token', jwt.encode({ company_id: id }, config.tokenKey))
                .send({
                    company_id: id,
                    username: 'Test username',
                    email: 'test@mail.ru', // unique email
                    password: '123',
                    type: 4
                })
                .end((err, res) => {
                    expect(err).toBe(null)
                    res.should.have.status(400)
                    res.should.have.header('content-type', 'application/json; charset=utf-8')
                    res.body.should.have.to.deep.equal({ result: 'Не верно выбрана роль пользователя', status: 400 })
                    done()
                })
            })
        })
    })
})