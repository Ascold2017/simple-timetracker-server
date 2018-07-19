const mongoose = require('mongoose')
const mongodb = require('../config.json').mongodb
mongoose.connect(mongodb.link)

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
	console.log('Connected to database!')
})

module.exports = require('./collections')