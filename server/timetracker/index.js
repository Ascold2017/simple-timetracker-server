const config = require('../../config')
require('../../database')
const ms = require('@nauma/node-microservice')
const timetracker = new ms.Microservice(config.microservices.timetracker.name, config.microservices.timetracker.connection)
const express = require('express')
const mongoose = require('mongoose')
const User = require('../../database').User
