const config = require('../../config')
const ms = require('@nauma/node-microservice')
const user = new ms.Microservice(config.microservices.user.name, config.microservices.user.connection)
const express = require('express')
const mongoose = require('mongoose')
const User = require('../../database').User
const Company = require('../../database').Company

user.get(config.microservices.rest.name)
    .on('create', response => {

        Company.findById(response.result.company_id)
            .then(company => {
                if (!company) throw new Error('Company not exist!')

                const newUser = new User({
                    company_id: response.result.company_id,
                    username: response.result.username,
                    email: response.result.email,
                    password: '123',
                    type: response.result.type
                })
        
                newUser.save()
                    .then(() => response.reply({ message: 'User successfully created!' }))
                    .catch(() => { throw new Error(e.message) })
            })
            .catch(e => response.reply({ message: e.message }))
    })