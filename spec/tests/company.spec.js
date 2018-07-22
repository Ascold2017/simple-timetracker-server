const chai = require('chai')
const chaiHttp  = require('chai-http')
const app = require('../../app')

const should = chai.should()
chai.use(chaiHttp)

const db = require('../../database')

describe('Test company', () => {

    beforeEach(done => {
        let prms = []
        prms.push(db.Company.remove({}))
        prms.push(db.User.remove({}))
        Promise.all(prms).then(() => done())
    })

    describe('post /createCompany', () => {
        it('valid send', (done) => {
            chai
            .request(app)
            .post('/api/createCompany')
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
    })

    describe('get /findCompanies', () => {
        beforeEach(done => {
            new db.Company({ name: 'Test 1.4' })
            .save()
            .then(company =>  done())
        })

        it('correct form', done => {
            chai
            .request(app)
            .get('/api/findCompanies')
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

    describe('post /createCompany', () => {
        beforeEach(done => {
            new db.Company({
                name: 'Test name 2',
            })
            .save()
            .then(company => new db.User({
                username: 'Test username',
                email: 'test13@mail.ru',
                type: 2,
                password: '123',
                company_id: company._id

            }).save())
            .then(() => done())
        })

        it('invalid name and existed email', (done) => {
        
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

    describe('post /createCompany', () => {
        beforeEach(done => {
            new db.Company({
                name: 'Test name 2',
            })
            .save()
            .then(company => new db.User({
                username: 'Test username',
                email: 'test14@mail.ru',
                type: 2,
                password: '123',
                company_id: company._id

            }).save())
            .then(() => done())
        })

        it('invalid name and valid email', (done) => {
        
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

    describe('post /createCompany', () => {

        it('Empty field', (done) => {
        
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
})
