const config = require('../../config')
const ms = require('@nauma/node-microservice')
const express = require('express')

const auth = new ms.Microservice(config.microservices.auth.name, config.microservices.auth.connection)

const login = require('./login')

auth.on('login', login)