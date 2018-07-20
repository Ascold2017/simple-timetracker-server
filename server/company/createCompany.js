const express = require('express')
const Company = require('../../database').Company
const User = require('../../database').User
const ms = require('@nauma/node-microservice')
const config = require('../../config')
const company = new ms.Clientservice('company', [ "user@localhost:9702" ])

const user = company.get('user')

module.exports = response => {
    const newCompany = new Company({
        name: response.result.name
    })

    newCompany.save()
    .then(createdCompany => {
        return new Promise(resolve => {
            user.send('create', {
                company_id: createdCompany._id,
                username: response.result.username,
                email: response.result.email,
                password: '123',
                type: 2 // admin
            }, response => resolve(response))
        })
    })
    .then(() => response.reply({ message: 'Company successfully created!' }))
    .catch(e => response.reply({ message: e.message }))
}
