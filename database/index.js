const config = require('../config.json')
const mongoose = require('mongoose')

mongoose.connect(config.mongodb.link)
mongoose.Promise = Promise
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
	console.log('Connected to database!')
})

module.exports = require('./collections')