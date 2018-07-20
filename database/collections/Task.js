const name = 'Task'

const mongoose = require('mongoose')

let schema = mongoose.Schema({
	company_id: {
		type: String,
        required: true
	},

	name: {
		type: String,
        required: true
    }
})

module.exports = {
	[name]: mongoose.model(name, schema)
}