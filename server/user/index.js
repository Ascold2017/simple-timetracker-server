const config = require('../../config')
require('../../database')
const ms = require('@nauma/node-microservice')
const user = new ms.Microservice(config.microservices.user.name, config.microservices.user.connection)
const express = require('express')
const mongoose = require('mongoose')
const User = require('../../database').User
