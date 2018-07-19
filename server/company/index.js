const config = require('../../config')
const ms = require('@nauma/node-microservice')
const express = require('express')
const Company = require('../../database').Company
const User = require('../../database').User

const company = new ms.Microservice(config.microservices.company.name, config.microservices.company.connection)

company.get(config.microservices.rest.name)
    .on('create', response => {

        const newCompany = new Company({
            name: response.result.name
        })

        newCompany.save()
            .then(createdCompany => {

                const newAdmin = new User({
                    company_id: createdCompany._id,
                    username: response.result.username,
                    email: response.result.email,
                    password: '123',
                    type: 2 // admin
                })
                
                return newAdmin.save()
            })
            .then(() => response.reply({ message: 'Company successfully created!' }))
            .catch(e => response.reply({ message: e.message }))

       
    })