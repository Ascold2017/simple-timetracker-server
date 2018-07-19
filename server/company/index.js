const config = require('../../config')
const ms = require('@nauma/node-microservice')
const express = require('express')

const auth = new ms.Microservice(config.microservices.company.name, config.microservices.company.connection)

auth.get(config.microservices.rest.name)
    .on('create', response => {
        console.log('create: ', response.result)
        response.reply('ok')
    })