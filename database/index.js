const mongoose = require('mongoose')

mongoose.connect('mongodb://ascold2018:ascold2018@ds237120.mlab.com:37120/simple-timetracker-server')

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
	console.log('Connected to database!')
})

module.exports = require('./collections')