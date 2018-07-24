const chai = require('chai')
const chaiHttp  = require('chai-http')
const app = require('../../app').app

const should = chai.should()
chai.use(chaiHttp)

const db = require('../../database')

describe('Test task', () => {

    beforeEach(done => {
        let prms = []
        prms.push(db.Company.remove({}))
        prms.push(db.Task.remove({}))
        Promise.all(prms).then(() => done())
    })

    describe('Test POST /api/createTask', () => {
        it('valid form', done => {
            let id = null
            new db.Company({ name: 'Test 1.9' })
            .save()
            .then(company => {
                id = company._id

                chai
                .request(app)
                .post('/api/createTask')
                .send({
                    company_id: id,
                    name: 'Test task'
                })
                .end((err, res) => {
                    expect(err).toBe(null)
                    res.should.have.status(200)
                    res.should.have.header('content-type', 'application/json; charset=utf-8')
                    res.body.should.have.to.deep.equal({ result: 'Таск успешно создан!', status: 200 })
                    done()
                })
            })
        })

        it('task already exist in company', done => {
            let id = null
            new db.Company({ name: 'Test 1.9' })
            .save()
            .then(company => {
                id = company._id
                return new db.Task({
                    company_id: id,
                    name: 'Test task 1'
                })
                .save()
            })
            .then(() => {

                chai
                .request(app)
                .post('/api/createTask')
                .send({
                    company_id: id,
                    name: 'Test task 1'
                })
                .end((err, res) => {
                    expect(err).toBe(null)
                    res.should.have.status(400)
                    res.should.have.header('content-type', 'application/json; charset=utf-8')
                    res.body.should.have.to.deep.equal({ result: 'Такой таск уже есть в компании', status: 400 })
                    done()
                })
            })
        })

        it('task already exist in other company', done => {
            let id = null
            new db.Company({ name: 'Test 1.9' })
            .save()
            .then(company => {
                id = company._id
                return new db.Task({
                    company_id: id,
                    name: 'Test task 1'
                })
                .save()
            })
            .then(() => {
                return new db.Company({ name: 'Test 1.10' }).save()
            })
            .then(company => { id = company._id })
            .then(() => {

                chai
                .request(app)
                .post('/api/createTask')
                .send({
                    company_id: id,
                    name: 'Test task 1'
                })
                .end((err, res) => {
                    expect(err).toBe(null)
                    res.should.have.status(200)
                    res.should.have.header('content-type', 'application/json; charset=utf-8')
                    res.body.should.have.to.deep.equal({ result: 'Таск успешно создан!', status: 200 })
                    done()
                })
            })
        })

        it('company not choosed', done => {

            chai
            .request(app)
            .post('/api/createTask')
            .send({
                company_id: null,
                name: 'Test task'
            })
            .end((err, res) => {
                expect(err).toBe(null)
                res.should.have.status(400)
                res.should.have.header('content-type', 'application/json; charset=utf-8')
                res.body.should.have.to.deep.equal({ result: 'Не выбрана компания', status: 400 })
                done()
            })
            
        })

        it('namr not fill', done => {
            let id = null
            new db.Company({ name: 'Test 1.9' })
            .save()
            .then(company => {
                id = company._id
                chai
                .request(app)
                .post('/api/createTask')
                .send({
                    company_id: id,
                    name: null
                })
                .end((err, res) => {
                    expect(err).toBe(null)
                    res.should.have.status(400)
                    res.should.have.header('content-type', 'application/json; charset=utf-8')
                    res.body.should.have.to.deep.equal({ result: 'Название таска обязательно', status: 400 })
                    done()
                })
            })
            
        })
    })

})