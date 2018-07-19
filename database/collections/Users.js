const name = 'User'

const mongoose = require('mongoose')

let schema = mongoose.Schema({
	username: {
		type: String,
		required: true
	},

	email: {
		type: String,
		trim: true,
		unique: true,
		required: true
	},

	password: {
		type: String,
        required: true,
        trim: true,
	},

	token: String
})

module.exports = {
	[name]: mongoose.model(name, schema)
}
